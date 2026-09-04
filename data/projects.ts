export type Project = {
  slug: string;
  name: string;
  cardTitle?: string;
  type: string;
  year: string;
  summary: string;
  role: string;
  context: string;
  keyWork: string[];
  technologies: string;
  about: string;
  cover: string;
  gallery: string[];
  url?: string;
  linkLabel?: string;
  privateLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "calvin-vazquez", name: "Calvin Vazquez", cardTitle: "Calvin", type: "Créateur de contenu visuel", year: "2025 - 2026",
    summary: "Designer, photographe et vidéaste : je crée des visuels, images et vidéos conçus pour capter l'attention et valoriser chaque projet.",
    role: "Designer, photographe & vidéaste", context: "Freelance · Suisse",
    keyWork: ["Direction artistique et identité visuelle", "Photographie professionnelle et événementielle", "Production et montage vidéo", "Maquettes de sites web, logos, badges et supports imprimés"],
    technologies: "Adobe Photoshop · Illustrator · InDesign · Lightroom · Premiere Pro · After Effects · Figma · Blender",
    about: "En parallèle de ma maturité technique au Centre professionnel du Nord vaudois, je développe une activité freelance. Après mon apprentissage de médiamaticien à la Police cantonale vaudoise, je poursuis des mandats créatifs et structure progressivement des projets et des équipes.",
    cover: "/projects/01-matteo-giaquinto/calvin-vazquez-portrait.png", gallery: [], url: "https://calvinvazquez.ch/", linkLabel: "Voir mon site ↗"
  },
  {
    slug: "paynova", name: "Paynova", type: "Prototype fintech", year: "2024",
    summary: "Un prototype bancaire fictif réunissant comptes sécurisés, gestion des cartes et profils, paiements entre particuliers simulés et suivi des transactions.",
    role: "Développeur full-stack", context: "Projet scolaire",
    keyWork: ["Tableau de bord de compte sécurisé", "Paiements entre particuliers simulés", "Gestion des comptes, cartes et profils", "Historique des transactions et soldes"],
    technologies: "Python · Flask · SQLite · HTML · CSS · JavaScript",
    about: "Un prototype bancaire fictif conçu et développé dans le cadre d'un projet scolaire. Il explore les interactions essentielles d'un produit bancaire numérique, de l'authentification sécurisée à la gestion des cartes, virements et transactions.",
    cover: "/projects/02-paynova/cover.webp", gallery: ["/projects/02-paynova/gallery/01.webp", "/projects/02-paynova/gallery/02.webp", "/projects/02-paynova/gallery/03.webp"], url: "https://github.com/matteogiaquinto/digital-bank-webapp", linkLabel: "Voir sur GitHub ↗"
  },
  {
    slug: "swiss-street-workout", name: "Swiss Street Workout", type: "Site de fédération", year: "2026",
    summary: "Un site de fédération repensé autour de l'inscription, de l'édition multilingue et d'une identité sportive plus affirmée.",
    role: "Directeur digital", context: "Fédération suisse de street workout",
    keyWork: ["Parcours utilisateur orienté inscription", "Site en quatre langues", "Blog localisé et référencement", "Transitions Barba et système de mouvement"],
    technologies: "HTML · CSS · JavaScript · Barba.js · GSAP · Netlify",
    about: "Une refonte complète pour la Fédération suisse de street workout. Le projet réunit inscriptions, travail éditorial et identité sportive dans une expérience numérique unique et claire.",
    cover: "/projects/03-swiss-street-workout/cover.webp", gallery: ["/projects/03-swiss-street-workout/gallery/01.mp4", "/projects/03-swiss-street-workout/gallery/02.webp", "/projects/03-swiss-street-workout/gallery/03.mp4", "/projects/03-swiss-street-workout/gallery/04.webp", "/projects/03-swiss-street-workout/gallery/05.webp", "/projects/03-swiss-street-workout/gallery/06.webp"], url: "https://swissstreetworkout.ch/", linkLabel: "Voir le site ↗"
  },
  {
    slug: "stilla-oils", name: "Stilla Oils", type: "Refonte Shopify", year: "2026",
    summary: "Une boutique Shopify renouvelée qui associe assainissement technique, système visuel plus clair et images produits affinées.",
    role: "Design & développement", context: "Projet client",
    keyWork: ["Assainissement technique Shopify", "Refonte de la boutique", "Photographie de produits", "Amélioration d'images par IA"],
    technologies: "Shopify · Adobe Photoshop · AI Image Tools",
    about: "Un renouvellement visuel et technique pour une boutique d'huiles naturelles. Le travail aligne l'expérience d'achat, les images produits et la configuration Shopify dans un ensemble plus calme et plus lisible.",
    cover: "/projects/04-stilla-oils/cover.webp", gallery: ["/projects/04-stilla-oils/gallery/01.webp", "/projects/04-stilla-oils/gallery/02.webp", "/projects/04-stilla-oils/gallery/03.webp"], privateLabel: "Site bientôt disponible"
  },
  {
    slug: "union-communale-lucens", name: "Union Communale Lucens", cardTitle: "UCL", type: "Identité de campagne", year: "2026",
    summary: "Une campagne municipale unifiée qui couvre identité visuelle, site, supports imprimés et portraits des membres.",
    role: "Designer & développeur", context: "Campagne municipale 2026",
    keyWork: ["Identité visuelle de campagne", "Site responsive", "Portraits des membres et retouche", "Coordination de la production imprimée"],
    technologies: "HTML · CSS · JavaScript · GSAP · Lenis",
    about: "Une identité complète et une campagne numérique pour les élections municipales de Lucens en 2026. Le travail couvre le site de campagne, les supports imprimés et une série cohérente de portraits pour chaque candidat.",
    cover: "/projects/05-union-communale-lucens/cover.webp", gallery: ["/projects/05-union-communale-lucens/gallery/01.webp", "/projects/05-union-communale-lucens/gallery/02.webp", "/projects/05-union-communale-lucens/gallery/03.webp", "/projects/05-union-communale-lucens/gallery/04.webp"], url: "https://union-lucens.ch/", linkLabel: "Voir le site ↗"
  },
  {
    slug: "tir-300-villeneuve", name: "Tir 300 Villeneuve", type: "Site de club & CMS", year: "2025",
    summary: "Un site de club doté d'une navigation claire, d'interactions guidées par une flèche et d'une interface protégée pour publier les contenus du quotidien.",
    role: "Développeur web", context: "Projet client",
    keyWork: ["Interface d'administration protégée", "Agenda, événements, résultats et galerie", "Curseur SVG et motif flèche sur mesure", "Navigation accessible et simplifiée"],
    technologies: "Flask · SQLAlchemy · JavaScript · CSS",
    about: "Un site sur mesure et un CMS léger pour un club de tir à Villeneuve. Les membres peuvent publier actualités, informations pratiques et résultats qui font vivre le club tout au long de la saison.",
    cover: "/projects/06-tir-300-villeneuve/cover.webp", gallery: ["/projects/06-tir-300-villeneuve/gallery/01.webp", "/projects/06-tir-300-villeneuve/gallery/02.webp", "/projects/06-tir-300-villeneuve/gallery/03.webp", "/projects/06-tir-300-villeneuve/gallery/04.webp", "/projects/06-tir-300-villeneuve/gallery/05.webp"], url: "https://www.tir300villeneuvefr.ch/", linkLabel: "Voir le site ↗"
  },
  {
    slug: "evo360", name: "Evo360", type: "Stratégie digitale", year: "2026",
    summary: "Un partenariat numérique continu qui couvre développement du site et CMS, positionnement de marque et processus de publication structuré.",
    role: "Stratégie digitale & développement", context: "Projet client",
    keyWork: ["Administration CMS sur mesure", "Processus de publication versionné avec Git", "Positionnement de marque et identité visuelle", "Accompagnement continu du site et du marketing"],
    technologies: "Eleventy · Keystatic · Cloudflare Pages",
    about: "Un partenariat numérique continu qui relie stratégie, identité et outils de publication. Le site donne à l'équipe une plateforme durable pour son travail et sa voix.",
    cover: "/projects/07-evo360/cover.webp", gallery: [], url: "https://evo360.ch/", linkLabel: "Voir le site ↗"
  },
  {
    slug: "tennis-club-de-lucens", name: "Tennis Club de Lucens", cardTitle: "Tennis Club Lucens", type: "Web design & expérience digitale", year: "2025",
    summary: "Une expérience digitale claire et accessible pour moderniser la présence en ligne du club et guider naturellement vers la réservation ou l'inscription.",
    role: "Direction artistique, UX/UI, web design & développement", context: "Tennis Club de Lucens",
    keyWork: ["Architecture UX centrée sur la réservation et l'inscription", "Direction artistique contemporaine et accessible", "Interfaces responsive pour desktop et mobile", "Contenus et intégration digitale"],
    technologies: "Web design · UX/UI · Développement web · Responsive design",
    about: "Un site pensé pour rendre les informations essentielles du club simples à trouver : découvrir le club, consulter les cotisations, réserver un court et s'inscrire. L'expérience conserve un ton humain et local, fidèle à l'ambiance conviviale du TC Lucens.",
    cover: "/projects/08-tennis-club-lucens/03.png", gallery: ["/projects/08-tennis-club-lucens/01.png", "/projects/08-tennis-club-lucens/02.png"]
  },
  {
    slug: "mercedes-cla-45s", name: "Mercedes-AMG CLA 45 S", type: "Photographie automobile", year: "2025",
    summary: "Une production visuelle automobile qui met en valeur les lignes, les détails et l'énergie d'une Mercedes-AMG CLA 45 S.",
    role: "Direction artistique, tournage & photographie automobile", context: "Piamotors Detailing Automobile",
    keyWork: ["Direction artistique et composition d'images", "Photographie automobile", "Tournage et plans de détail", "Contenus digitaux photo et vidéo"],
    technologies: "Photographie · Production vidéo · Éclairage · Post-production",
    about: "Une production conçue pour traduire le caractère sportif de la Mercedes-AMG CLA 45 S et renforcer l'univers premium de Piamotors Detailing Automobile, à travers une esthétique dynamique et maîtrisée.",
    cover: "/projects/09-mercedes-cla-45s/03.webp", gallery: ["/projects/09-mercedes-cla-45s/01.webp", "/projects/09-mercedes-cla-45s/02.webp"]
  },
  {
    slug: "soiree-gym-aubonne-2024", name: "Soirée de gym d'Aubonne 2024", type: "Photographie événementielle", year: "2024",
    summary: "Un reportage photo au cœur d'une soirée qui réunit jeunes gymnastes, adultes expérimentés, performances collectives et moments de scène.",
    role: "Photographie, cadrage, sélection & retouche", context: "Soirée de gym d'Aubonne",
    keyWork: ["Reportage photo événementiel", "Photographie d'action et de scène", "Gestion de la lumière", "Sélection, retouche et export"],
    technologies: "Photographie · Cadrage · Retouche · Direction visuelle",
    about: "Une série d'images créée pour restituer l'énergie de l'événement, la diversité des performances et l'engagement des participants sur scène.",
    cover: "/projects/10-gym-aubonne-2024/03.webp", gallery: ["/projects/10-gym-aubonne-2024/01.jpg", "/projects/10-gym-aubonne-2024/02.webp"]
  },
  {
    slug: "swiss-police-throwdown-2022", name: "Swiss Police Throwdown 2022", type: "Vidéo sportive & événementielle", year: "2022",
    summary: "Une vidéo événementielle autour d'une compétition suisse de crossfit réunissant policiers et gendarmes de tout le pays.",
    role: "Tournage, montage, rythme narratif & post-production", context: "Swiss Police Throwdown",
    keyWork: ["Captation sportive", "Tournage événementiel", "Montage dynamique et storytelling", "Étalonnage et contenus digitaux"],
    technologies: "Production vidéo · Montage · Color grading · YouTube",
    about: "Un aftermovie conçu pour restituer l'intensité d'un championnat suisse de crossfit, tout en donnant une place centrale à la cohésion et à l'engagement des participants.",
    cover: "/projects/11-swiss-police-throwdown/03.png", gallery: ["/projects/11-swiss-police-throwdown/01.png", "/projects/11-swiss-police-throwdown/02.png"]
  },
  {
    slug: "cartes-de-visite", name: "Cartes de visite", type: "Design print & identité", year: "Sélection",
    summary: "Une sélection de cartes de visite qui explore identité de marque, hiérarchie typographique et rendu premium sur support imprimé.",
    role: "Direction graphique, composition, typographie & préparation print", context: "Exemples personnels & concepts visuels",
    keyWork: ["Direction graphique", "Mise en page et hiérarchie typographique", "Identité visuelle", "Préparation print et mockups"],
    technologies: "Design graphique · Typographie · Print · Adobe Creative Cloud",
    about: "Une série de formats courts qui présente différentes approches de composition, de contraste typographique et d'univers de marque pour des cartes de visite.",
    cover: "/projects/12-cartes-de-visite/03.png", gallery: ["/projects/12-cartes-de-visite/01.png", "/projects/12-cartes-de-visite/02.png"]
  },
  {
    slug: "flyers", name: "Flyers", type: "Design print & communication", year: "Sélection",
    summary: "Une sélection de supports imprimés conçus pour attirer l'attention, structurer une information et transmettre un message avec clarté.",
    role: "Direction graphique, mise en page & préparation print", context: "Exemples personnels & concepts visuels",
    keyWork: ["Direction graphique", "Composition et hiérarchie visuelle", "Mise en page print", "Préparation à l'impression et mockups"],
    technologies: "Design graphique · Composition · Print · Adobe Creative Cloud",
    about: "Une série de flyers qui montre comment rythme, contraste et hiérarchie peuvent donner une présence forte à un message sur un support imprimé.",
    cover: "/projects/13-flyers/03.png", gallery: ["/projects/13-flyers/01.png", "/projects/13-flyers/02.png"]
  }
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
