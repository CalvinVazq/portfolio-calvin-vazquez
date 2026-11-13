import { load } from 'cheerio';

export const official = 'https://www.cotecoeurcotejardin.ch';
const tidy = (text = '') => text.replace(/[\s\u200B]+/g, ' ').trim();
const imageUrl = (url, size) => {
  if (!url) return null;
  const full = new URL(url, official);
  if (full.origin !== official || !full.pathname.startsWith('/web/image/')) return null;
  if (size) full.pathname = full.pathname.replace(/image_(?:1920|1024)/, 'image_' + size);
  return full.href;
};

export function parseCatalog(html) {
  const $ = load(html);
  const grid = $('#products_grid');
  if (!grid.length) throw new Error('Grille de produits introuvable');
  const products = $('.o_wsale_product_grid_wrapper').toArray().flatMap(card => {
    const item = $(card);
    const link = item.find('.o_wsale_product_information_text a').first();
    const url = link.attr('href')?.split('?')[0];
    if (!url?.startsWith('/shop/')) return [];
    return [{
      url,
      name: tidy(link.text()),
      image: imageUrl(item.find('img').first().attr('src'), 512),
      price: tidy(item.find('.product_price .oe_currency_value').first().text()),
    }];
  });
  const categories = [...new Map(
    $('#products_grid_before a[href^="/shop/category/"], #o_wsale_offcanvas a[href^="/shop/category/"]').toArray()
      .map(anchor => [$(anchor).attr('href').split('?')[0], tidy($(anchor).text())])
      .filter(([, name]) => name)
  )].map(([url, name]) => ({ url, name }));
  const pager = $('.pagination').first().find('li').toArray().flatMap(item => {
    const anchor = $(item).find('a');
    const url = anchor.attr('href');
    const label = tidy(anchor.text());
    if (!url && !label) return [];
    return [{ label, url: url?.startsWith('/shop') ? url : null, active: $(item).hasClass('active') || anchor.hasClass('active') }];
  });
  const filters = $('.o_wsale_products_grid_before_rail input[type="checkbox"][name], .o_wsale_products_grid_before_rail select[name]').toArray().flatMap(field => {
    const node = $(field);
    const name = node.attr('name');
    if (!['attrib', 'attribute_value', 'tags'].includes(name)) return [];
    return node.is('select')
      ? node.find('option[value]').toArray().filter(option => $(option).attr('value')).map(option => ({name, value: $(option).attr('value'), label: tidy($(option).text())}))
      : [{name, value: node.attr('value'), label: tidy(node.closest('label').text() || node.siblings('label').text())}];
  }).filter(filter => filter.label && filter.value);
  return { title: tidy(grid.find('h1').first().text()), products, categories, pager, filters };
}

export function parseProduct(html, url) {
  const $ = load(html);
  const page = $('.o_wsale_product_page');
  const name = tidy(page.find('h1').first().text());
  if (!name) return null;
  const schema = $('script[type="application/ld+json"]').toArray().flatMap(item => {
    try { return JSON.parse($(item).text()); } catch { return []; }
  }).find(item => ['Product', 'ProductGroup'].includes(item['@type']));
  const variants = (schema?.hasVariant || []).flatMap(variant => {
    const target = new URL(variant.url, official);
    if (target.origin !== official || target.pathname !== url) return [];
    return [{
      name: variant.name.slice(name.length).trim().replace(/^\(|\)$/g, '') || variant.name,
      url: target.pathname + target.search,
      image: imageUrl(variant.image, 1024),
      price: variant.offers?.price ?? null,
      availability: variant.offers?.availability?.split('/').at(-1) || null,
    }];
  });
  const gallery = [...new Set(page.find('.o_wsale_product_images img.product_detail_img').toArray()
    .map(img => imageUrl($(img).attr('src'), 1024)).filter(Boolean))];
  if (!gallery.length && schema?.image) gallery.push(imageUrl(schema.image, 1024));
  const description = page.find('#product_details .oe_structure p, #product_details > p, #product_full_description p, #product_full_description li, #product_full_description h2, #product_full_description h3').toArray()
    .map(node => tidy($(node).text())).filter(Boolean);
  const detailLinks = page.find('a[href^="/shop/category/"]').toArray();
  const categories = [...new Map(detailLinks.map(a => [$(a).attr('href').split('?')[0], tidy($(a).text())]))].map(([url, name]) => ({url,name}));
  return {
    name, url, description: [...new Set(description)], gallery, categories, variants,
    price: tidy(page.find('.product_price .oe_currency_value').first().text()),
    availability: schema?.offers?.availability?.split('/').at(-1) || null,
  };
}
