"use client";
/* eslint-disable @next/next/no-img-element -- Osmo tiles require native image elements for their 3D transforms. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Project, projects } from "../data/projects";

export function PortfolioExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const goToProjectRef = useRef<((slug: string) => void) | null>(null);
  const moveTileRef = useRef<((step: 1 | -1) => void) | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectSlug, setActiveProjectSlug] = useState(projects[0]?.slug ?? "");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contactMenuRef = useRef<HTMLDivElement | null>(null);
  const projectsMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isContactOpen && !isProjectsOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!contactMenuRef.current?.contains(target) && !projectsMenuRef.current?.contains(target)) {
        setIsContactOpen(false);
        setIsProjectsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsContactOpen(false);
        setIsProjectsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isContactOpen, isProjectsOpen]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(CustomEase);
    CustomEase.create("osmo", "M0,0 C0.625,0.05 0,1 1,1");

    const collection = container.querySelector<HTMLElement>("[data-perspective-tiles-collection]");
    const list = container.querySelector<HTMLElement>("[data-perspective-tiles-list]");
    const tiles = [...container.querySelectorAll<HTMLElement>("[data-perspective-tiles-item]")];
    const tileCount = tiles.length;
    if (!collection || !list || tileCount < 2) return;
    container.classList.remove("is-intro-ready");

    const gapPercent = 0.45;
    const perspectiveMultiplier = 4;
    const blurMultiplier = 0.005;
    const minOpacity = 1;
    const minDarkness = 0.75;
    const maxTiltX = 8;
    const maxTiltY = 8;
    const tiltMoveDuration = 0.6;
    const moveDuration = 1.05;
    const staggerAmount = moveDuration * 0.005;
    const tiltEnabled = container.getAttribute("data-perspective-tiles-tilt") === "true";
    const isFlipped = container.getAttribute("data-perspective-tiles-flipped") === "true";
    const direction = isFlipped ? -1 : 1;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const fullCircle = Math.PI * 2;
    const tileStates = tiles.map(() => ({ progress: 0 }));

    let radius = 0;
    let maxBlur = 0;
    let stepTimeline: gsap.core.Timeline | undefined;
    let introTimeline: gsap.core.Timeline | undefined;
    let activeTileIndex = -1;
    let wheelDelta = 0;
    let introComplete = false;
    let swipeStart: { x: number; y: number } | undefined;
    let didSwipe = false;

    gsap.set(collection, { transformStyle: "preserve-3d", transformOrigin: "50% 50%" });
    gsap.set(list, { transformStyle: "preserve-3d" });

    function updateMeasurements() {
      const tileWidth = tiles[0].offsetWidth;
      const tileHeight = tiles[0].offsetHeight;
      radius = tileWidth * (1 + gapPercent) / (2 * Math.tan(Math.PI / tileCount));
      maxBlur = tileWidth * blurMultiplier;
      gsap.set(collection, { transformPerspective: radius * perspectiveMultiplier });
      container?.style.setProperty("--floor-offset", `${tileHeight / 2}px`);
    }

    function getActiveIndex() {
      return tileStates.reduce((closest, state, index) => {
        const current = ((index - state.progress) % tileCount + tileCount) % tileCount;
        const previous = ((closest - tileStates[closest].progress) % tileCount + tileCount) % tileCount;
        return Math.min(current, tileCount - current) < Math.min(previous, tileCount - previous) ? index : closest;
      }, 0);
    }

    function updateTileStatus() {
      const currentActiveIndex = getActiveIndex();
      if (currentActiveIndex === activeTileIndex) return;
      activeTileIndex = currentActiveIndex;
      setActiveProjectSlug(projects[activeTileIndex]?.slug ?? "");
      tiles.forEach((tile, index) => tile.setAttribute("data-perspective-tiles-item-status", index === activeTileIndex ? "active" : "not-active"));
    }

    function renderPerspectiveTiles() {
      updateTileStatus();
    tiles.forEach((tile, index) => {
        const angle = ((index - tileStates[index].progress) / tileCount) * fullCircle * direction;
        const depth = (Math.cos(angle) + 1) / 2;
        const depthCurve = depth * depth * (3 - 2 * depth);
        const opacity = gsap.utils.interpolate(minOpacity, 1, depthCurve);
        const blur = gsap.utils.interpolate(maxBlur, 0, depthCurve);
        const brightness = gsap.utils.interpolate(minDarkness, 1, depthCurve);
        gsap.set(tile, {
          x: Math.sin(angle) * radius,
          z: Math.cos(angle) * radius,
          rotateY: angle * 180 / Math.PI,
          opacity,
          filter: `blur(${blur}px) brightness(${brightness})`,
          zIndex: Math.round(depth * 1000)
        });
      });
    }

    function goToNextTile(step: 1 | -1, onComplete?: () => void, steps = 1) {
      if (stepTimeline?.isActive()) return;
      const activeIndex = getActiveIndex();
      const duration = Math.min(moveDuration + (steps - 1) * 0.1, 1.65);
      const orderedStates = tileStates
        .map((state, index) => ({ state, offset: (index - activeIndex + tileCount) % tileCount }))
        .sort((a, b) => step === 1 ? a.offset - b.offset : b.offset - a.offset);

      stepTimeline = gsap.timeline({ paused: true, onComplete });
      orderedStates.forEach(({ state }, index) => {
        stepTimeline?.to(state, { progress: state.progress + step * steps, duration, ease: "power3.inOut", onUpdate: renderPerspectiveTiles }, index * staggerAmount);
      });
      stepTimeline.play();
    }

    function requestTileMove(step: 1 | -1) {
      // A scroll gesture always advances exactly one card. Ignore any extra
      // wheel events until the current transition has fully settled.
      if (stepTimeline?.isActive()) return;
      goToNextTile(step);
    }

    function goToProject(slug: string) {
      if (!introComplete || stepTimeline?.isActive()) return;
      const targetIndex = projects.findIndex((project) => project.slug === slug);
      const activeIndex = getActiveIndex();
      if (targetIndex < 0 || targetIndex === activeIndex) return;

      const forwardDistance = (targetIndex - activeIndex + tileCount) % tileCount;
      const backwardDistance = (activeIndex - targetIndex + tileCount) % tileCount;
      const step: 1 | -1 = forwardDistance <= backwardDistance ? 1 : -1;
      goToNextTile(step, undefined, Math.min(forwardDistance, backwardDistance));
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!introComplete) return;
      wheelDelta += event.deltaY;
      if (Math.abs(wheelDelta) < 32) return;
      requestTileMove(wheelDelta > 0 ? 1 : -1);
      wheelDelta = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      swipeStart = { x: event.clientX, y: event.clientY };
      didSwipe = false;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!swipeStart || event.pointerType === "mouse") return;
      const deltaX = event.clientX - swipeStart.x;
      const deltaY = event.clientY - swipeStart.y;
      swipeStart = undefined;
      if (!introComplete || Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 36) return;
      didSwipe = true;
      const isVerticalSwipe = Math.abs(deltaY) >= Math.abs(deltaX);
      requestTileMove(isVerticalSwipe ? (deltaY < 0 ? 1 : -1) : (deltaX < 0 ? 1 : -1));
    };
    const onPointerCancel = () => { swipeStart = undefined; };
    const onClickCapture = (event: MouseEvent) => {
      if (!didSwipe) return;
      event.preventDefault();
      event.stopPropagation();
      didSwipe = false;
    };

    const tiltX = gsap.quickTo(collection, "rotationX", { duration: tiltMoveDuration, ease: "power3.out" });
    const tiltY = gsap.quickTo(collection, "rotationY", { duration: tiltMoveDuration, ease: "power3.out" });
    const onPointerMove = (event: PointerEvent) => {
      if (!introComplete) return;
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const floorTilt = Math.max(0, y * 2);
      tiltX(-floorTilt * maxTiltY);
      tiltY(x * maxTiltX * 2);
    };
    const onPointerLeave = () => {
      tiltX(0);
      tiltY(0);
    };

    if (tiltEnabled && canHover) {
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerleave", onPointerLeave);
    }
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerCancel);
    container.addEventListener("click", onClickCapture, true);

    updateMeasurements();
    renderPerspectiveTiles();

    // Build the existing 3D layout from its center, then hand control back to the normal renderer.
    const finalTileTransforms = tiles.map((tile) => ({
      x: Number(gsap.getProperty(tile, "x")),
      z: Number(gsap.getProperty(tile, "z")),
      rotateY: Number(gsap.getProperty(tile, "rotationY")),
      opacity: Number(gsap.getProperty(tile, "opacity"))
    }));
    gsap.set(collection, { y: 0, rotationY: 0 });
    finalTileTransforms.forEach((transform, index) => {
      gsap.set(tiles[index], {
        x: transform.x * 0.16,
        z: transform.z * 0.16,
        rotateY: transform.rotateY,
        scale: 0.12,
        opacity: 0.5,
        filter: "blur(8px) brightness(.8)"
      });
    });
    container.classList.add("is-intro-ready");

    introTimeline = gsap.timeline({
      onComplete: () => {
        gsap.set(collection, { y: 0, rotationY: 0 });
        tiles.forEach((tile) => gsap.set(tile, { scale: 1 }));
        renderPerspectiveTiles();
        introComplete = true;
      }
    });
    finalTileTransforms.forEach((transform, index) => {
      introTimeline?.to(tiles[index], {
        x: transform.x,
        z: transform.z,
        rotateY: transform.rotateY,
        opacity: transform.opacity,
        scale: 1,
        duration: 7.2,
        ease: "osmo"
      }, 0);
    });
    introTimeline
      .to(collection, { rotationY: direction * 720, duration: 7.2, ease: "osmo" }, 0)
      .to(tiles, { filter: "blur(0px) brightness(1)", duration: 3.2, ease: "power2.out" }, 0);
    goToProjectRef.current = goToProject;
    moveTileRef.current = (step) => {
      if (introComplete) requestTileMove(step);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements();
      if (introComplete) renderPerspectiveTiles();
    });
    resizeObserver.observe(container);

    return () => {
      stepTimeline?.kill();
      introTimeline?.kill();
      goToProjectRef.current = null;
      moveTileRef.current = null;
      container.classList.remove("is-intro-ready");
      resizeObserver.disconnect();
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerCancel);
      container.removeEventListener("click", onClickCapture, true);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  const activeProjectIndex = Math.max(0, projects.findIndex((project) => project.slug === activeProjectSlug));
  const carouselProgress = activeProjectIndex === 0
    ? "À propos de moi"
    : `Projet ${String(activeProjectIndex).padStart(2, "0")} / ${String(projects.length - 1).padStart(2, "0")}`;

  return <>
    {(isContactOpen || isProjectsOpen) && <div className="contact-backdrop" aria-hidden="true" />}
    <nav className={`site-nav ${selectedProject ? "is-detail-open" : ""} ${isMobileMenuOpen ? "is-menu-open" : ""}`} aria-label="Navigation principale">
      <button type="button" className="site-nav__brand" onClick={() => goToProjectRef.current?.("calvin-vazquez")}>Calvin Vazquez</button>
      <button type="button" className="site-nav__toggle" aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={isMobileMenuOpen} onClick={() => { setIsMobileMenuOpen((value) => !value); setIsContactOpen(false); setIsProjectsOpen(false); }}><span /><span /><span /></button>
      <div className="site-nav__links">
        <div ref={projectsMenuRef} className={`projects-menu ${isProjectsOpen ? "is-open" : ""}`}>
          <button type="button" className="site-nav__link is-active" aria-expanded={isProjectsOpen} aria-controls="projects-menu" onClick={() => { setIsProjectsOpen((value) => !value); setIsContactOpen(false); }}>Projets</button>
          <div id="projects-menu" className="projects-menu__popover" role="dialog" aria-label="Liste des projets" aria-hidden={!isProjectsOpen}>
            <div className="projects-menu__list">{projects.slice(1).map((project, projectIndex) => <button key={project.slug} type="button" onClick={() => { setIsProjectsOpen(false); setIsMobileMenuOpen(false); goToProjectRef.current?.(project.slug); }}><small>Projet {String(projectIndex + 1).padStart(2, "0")}</small><span>{project.name}</span><b aria-hidden="true">↗</b></button>)}</div>
          </div>
        </div>
        <button type="button" className="site-nav__link" onClick={() => { setSelectedProject(projects[0]); setIsMobileMenuOpen(false); setIsProjectsOpen(false); }}>À propos</button>
        <div ref={contactMenuRef} className={`contact-menu ${isContactOpen ? "is-open" : ""}`}>
          <button type="button" className={`site-nav__link ${isContactOpen ? "is-active" : ""}`} aria-expanded={isContactOpen} aria-controls="contact-menu" onClick={() => { setIsContactOpen((value) => !value); setIsProjectsOpen(false); }}>Contact</button>
          <div id="contact-menu" className="contact-menu__popover" role="dialog" aria-label="Informations de contact" aria-hidden={!isContactOpen}>
            <div className="contact-menu__intro">
              <div><p>Contact</p><h2>Discutons de<br />votre projet</h2></div>
              <span>Des idées,<br />des projets ou<br />simplement un message ?<br />Je suis toujours ouvert<br />à la discussion.</span>
            </div>
            <div className="contact-menu__details">
              <a className="contact-menu__row" href="mailto:contact@calvinvazquez.ch"><span className="contact-menu__icon" aria-hidden="true">✉</span><span><small>E-mail</small><strong>contact@calvinvazquez.ch</strong></span><b aria-hidden="true">↗</b></a>
              <a className="contact-menu__row" href="tel:+41791044003"><span className="contact-menu__icon contact-menu__icon--phone" aria-hidden="true">▯</span><span><small>Téléphone</small><strong>+41 79 104 40 03</strong></span><b aria-hidden="true">↗</b></a>
            </div>
            <a className="contact-menu__download" href="https://drive.google.com/file/d/1qTGZl9UiJu23YYBzuD8YXYs9rKkubRkl/view?usp=sharing" target="_blank" rel="noreferrer"><span className="contact-menu__document" aria-hidden="true">▱</span><span>Télécharger le CV</span><b aria-hidden="true">↗</b></a>
          </div>
        </div>
      </div>
    </nav>
    <section className={`osmo-section ${selectedProject ? "is-detail-open" : ""}`}>
    <div ref={containerRef} data-perspective-tiles-init="" data-perspective-tiles-pause-hover="false" data-perspective-tiles-tilt="true" data-perspective-tiles-flipped="false" className="perspective-tiles">
      <div data-perspective-tiles-collection="" className="perspective-tiles__collection">
        <div data-perspective-tiles-list="" className="perspective-tiles__list">
          {projects.map((project, index) => <button key={project.slug} type="button" data-perspective-tiles-item-status={index === 0 ? "active" : "not-active"} data-perspective-tiles-item="" className="perspective-tiles__item" onClick={() => setSelectedProject(project)} aria-label={`Ouvrir le projet ${project.name}`}>
            <span className="osmo-card"><img src={project.cover} alt="" className="cover-image" draggable={false} /><span className="osmo-card__title">{project.cardTitle ?? project.name}</span></span>
            <span className="perspective-tiles__reflection" aria-hidden="true">
              <span className="perspective-tiles__reflection-soft"><img src={project.cover} alt="" draggable={false} /></span>
              <span className="perspective-tiles__reflection-sharp"><img src={project.cover} alt="" draggable={false} /></span>
            </span>
          </button>
          )}
        </div>
      </div>
    </div>
    </section>
    <div className={`carousel-controls ${selectedProject ? "is-hidden" : ""}`} aria-label="Navigation des projets">
      <button type="button" onClick={() => moveTileRef.current?.(-1)} aria-label="Projet précédent">←</button>
      <button type="button" onClick={() => moveTileRef.current?.(1)} aria-label="Projet suivant">→</button>
    </div>
    <p className={`carousel-progress ${selectedProject ? "is-hidden" : ""}`} aria-live="polite">{carouselProgress}</p>
    {selectedProject && <ProjectDetail project={selectedProject} index={projects.findIndex((project) => project.slug === selectedProject.slug)} onClose={() => setSelectedProject(null)} />}
  </>;
}

function ProjectDetail({ project, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  const panelRef = useRef<HTMLElement | null>(null);
  const wheelDelta = useRef(0);
  const isGalleryMoving = useRef(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isCompactGallery, setIsCompactGallery] = useState(false);
  const media = [project.cover, ...project.gallery];
  const gallery = media.length ? media : [project.cover];
  const hasGalleryWheel = gallery.length > 1;
  const renderedGallery = isCompactGallery && hasGalleryWheel
    ? [gallery[gallery.length - 1], ...gallery, gallery[0]]
    : gallery;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateGalleryMode = () => setIsCompactGallery(mediaQuery.matches);
    updateGalleryMode();
    mediaQuery.addEventListener("change", updateGalleryMode);
    return () => mediaQuery.removeEventListener("change", updateGalleryMode);
  }, []);

  useEffect(() => {
    if (!isCompactGallery || !hasGalleryWheel || !orbitRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const firstProjectItem = orbitRef.current?.children[1] as HTMLElement | undefined;
      if (!firstProjectItem || !orbitRef.current) return;
      orbitRef.current.scrollLeft = firstProjectItem.offsetLeft + firstProjectItem.offsetWidth / 2 - orbitRef.current.clientWidth / 2;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isCompactGallery, hasGalleryWheel, project.slug]);

  useEffect(() => {
    if (!isCompactGallery || !hasGalleryWheel || !orbitRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const orbit = orbitRef.current;
      if (!orbit) return;
      const orbitCenter = orbit.scrollLeft + orbit.clientWidth / 2;
      const target = [...orbit.querySelectorAll<HTMLElement>(".gallery-orbit__item")]
        .filter((item) => Number(item.dataset.mediaIndex) === activeMediaIndex)
        .reduce<HTMLElement | undefined>((closest, item) => !closest || Math.abs(item.offsetLeft + item.offsetWidth / 2 - orbitCenter) < Math.abs(closest.offsetLeft + closest.offsetWidth / 2 - orbitCenter) ? item : closest, undefined);
      if (!target) return;
      gsap.to(orbit, { scrollLeft: target.offsetLeft + target.offsetWidth / 2 - orbit.clientWidth / 2, duration: 0.78, ease: "power3.inOut", overwrite: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeMediaIndex, hasGalleryWheel, isCompactGallery]);

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    const context = gsap.context(() => {
      gsap.timeline()
        .fromTo(panelRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power1.out" })
        .fromTo(".project-detail__gallery", { autoAlpha: 0, x: -42, clipPath: "inset(12% 16% 12% 16%)" }, { autoAlpha: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power3.inOut" }, 0)
        .fromTo("[data-detail-copy]", { autoAlpha: 0, y: 14, filter: "blur(14px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.76, stagger: 0.06, ease: "power4.out" }, 0.24);
    }, panelRef);
    return () => context.revert();
  }, [project.slug]);

  const close = () => {
    if (!panelRef.current) return onClose();
    gsap.timeline({ onComplete: onClose })
      .to("[data-detail-copy]", { autoAlpha: 0, y: -8, filter: "blur(8px)", duration: 0.2, stagger: 0.025, ease: "power2.in" })
      .to(".project-detail__gallery", { autoAlpha: 0, x: -28, duration: 0.32, ease: "power2.in" }, 0);
  };

  const normalizeLinearLoop = () => {
    if (!isCompactGallery || !orbitRef.current) return;
    const orbit = orbitRef.current;
    const items = [...orbit.querySelectorAll<HTMLElement>(".gallery-orbit__item")];
    if (items.length < 3) return;
    const firstProjectItem = items[1];
    const lastProjectItem = items[items.length - 2];
    const loopDistance = lastProjectItem.offsetLeft - firstProjectItem.offsetLeft;
    const orbitCenter = orbit.scrollLeft + orbit.clientWidth / 2;
    if (orbitCenter < firstProjectItem.offsetLeft + firstProjectItem.offsetWidth / 2 - firstProjectItem.offsetWidth * 0.55) orbit.scrollLeft += loopDistance;
    if (orbitCenter > lastProjectItem.offsetLeft + lastProjectItem.offsetWidth / 2 + lastProjectItem.offsetWidth * 0.55) orbit.scrollLeft -= loopDistance;
  };

  const changeGallery = (step: 1 | -1) => {
    if (!hasGalleryWheel || isGalleryMoving.current) return;
    isGalleryMoving.current = true;
    setActiveMediaIndex((value) => (value + step + gallery.length) % gallery.length);
    window.setTimeout(() => {
      isGalleryMoving.current = false;
      normalizeLinearLoop();
    }, 860);
  };

  const rotateGallery = (event: React.WheelEvent<HTMLDivElement>) => {
    if (isCompactGallery || !hasGalleryWheel || isGalleryMoving.current) return;
    wheelDelta.current += event.deltaY;
    if (Math.abs(wheelDelta.current) < 30) return;
    event.preventDefault();
    changeGallery(wheelDelta.current > 0 ? 1 : -1);
    wheelDelta.current = 0;
  };

  const getWheelPosition = (itemIndex: number) => {
    let distance = itemIndex - activeMediaIndex;
    const half = gallery.length / 2;
    if (distance > half) distance -= gallery.length;
    if (distance < -half) distance += gallery.length;
    if (gallery.length % 2 === 0 && Math.abs(distance) === half) distance = itemIndex > activeMediaIndex ? half : -half;

    const angle = distance * 54;
    const radians = (angle * Math.PI) / 180;
    const depth = Math.abs(distance);
    if (isCompactGallery) return {
      x: 50 + distance * 58,
      y: 50,
      rotation: 0,
      scale: depth === 0 ? 1 : 0.78,
      opacity: depth === 0 ? 1 : depth === 1 ? 0.58 : 0,
      brightness: depth === 0 ? 1 : 0.78,
      blur: depth === 0 ? 0 : 0.45,
      zIndex: 100 - Math.round(depth * 10)
    };
    return {
      x: -20 + Math.cos(radians) * 70,
      y: 50 + Math.sin(radians) * 58,
      rotation: distance * 17,
      scale: Math.max(0.62, 1 - depth * 0.16),
      opacity: depth === 0 ? 1 : depth === 1 ? 0.58 : 0,
      brightness: Math.max(0.62, 1 - depth * 0.14),
      blur: Math.min(depth * 0.7, 2),
      zIndex: 100 - Math.round(depth * 10)
    };
  };

  return <section ref={panelRef} className="project-detail" aria-label={`Projet ${project.name}`}>
    <button type="button" className="project-detail__close" onClick={close}>← Retour aux projets</button>
    <div className={`project-detail__gallery ${hasGalleryWheel ? "has-gallery-wheel" : ""} ${isCompactGallery ? "is-linear" : ""}`} onWheel={rotateGallery} onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={(event) => { if (!pointerStart.current) return; const deltaX = pointerStart.current.x - event.clientX; const deltaY = pointerStart.current.y - event.clientY; pointerStart.current = null; if (isCompactGallery && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 18) changeGallery(deltaX > 0 ? 1 : -1); if (!isCompactGallery && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 36) changeGallery(deltaY > 0 ? 1 : -1); }} onPointerCancel={() => { pointerStart.current = null; }}>
      <div ref={orbitRef} className="gallery-orbit">
        {renderedGallery.map((item, displayIndex) => {
          const itemIndex = isCompactGallery && hasGalleryWheel ? (displayIndex - 1 + gallery.length) % gallery.length : displayIndex;
          const position = getWheelPosition(itemIndex);
          const linearDistance = Math.min(Math.abs(itemIndex - activeMediaIndex), gallery.length - Math.abs(itemIndex - activeMediaIndex));
          return <div key={`${item}-${displayIndex}`} data-media-index={itemIndex} className="gallery-orbit__item" style={{ "--gallery-x": `${position.x}%`, "--gallery-y": `${position.y}%`, "--gallery-rotation": `${position.rotation}deg`, "--gallery-scale": position.scale, "--gallery-opacity": position.opacity, "--gallery-brightness": position.brightness, "--gallery-blur": `${position.blur}px`, "--linear-scale": linearDistance === 0 ? 1 : 0.86, "--linear-opacity": linearDistance === 0 ? 1 : linearDistance === 1 ? 0.34 : 0.18, "--linear-brightness": linearDistance === 0 ? 1 : 0.68, zIndex: position.zIndex } as React.CSSProperties}>
          {item.endsWith(".mp4") ? <video src={item} autoPlay loop muted playsInline /> : <img src={item} alt={`${project.name}, visuel ${itemIndex + 1}`} />}
          </div>;
        })}
      </div>
      {hasGalleryWheel && <p className="gallery-orbit__hint" aria-hidden="true"><span>{isCompactGallery ? "Glisser" : "Défiler"}</span><strong>{String(activeMediaIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</strong></p>}
    </div>
    <article className="project-detail__copy">
      <p className="detail-kicker" data-detail-copy>{index === 0 ? "À propos de moi" : `Projet sélectionné / ${String(index).padStart(2, "0")}`}</p>
      <h1 data-detail-copy>{project.name}</h1>
      <p className="detail-type" data-detail-copy>{project.type} · {project.year}</p>
      <p className="detail-summary" data-detail-copy>{project.summary}</p>
      <dl className="detail-facts" data-detail-copy><div><dt>Rôle</dt><dd>{project.role}</dd></div><div><dt>Contexte</dt><dd>{project.context}</dd></div><div><dt>Année</dt><dd>{project.year}</dd></div></dl>
      <section className="detail-work" data-detail-copy><p>Travail réalisé</p><ul>{project.keyWork.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="detail-block" data-detail-copy><p>Technologies</p><strong>{project.technologies}</strong></section>
      <section className="detail-block" data-detail-copy><p>À propos</p><span>{project.about}</span></section>
      {project.url ? <a className="detail-link" data-detail-copy href={project.url} target="_blank" rel="noreferrer">{project.linkLabel}</a> : <span className="detail-private" data-detail-copy>{project.privateLabel}</span>}
    </article>
  </section>;
}
