import { access, readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";

const pages = [
  "index.html",
  "es/index.html",
  "idatziak/index.html",
  "idatziak/historiak-ez-du-pilotu-automatikorik/index.html",
  "idatziak/ispilu-deserosoa/index.html",
  "idatziak/la-carretera-itxaropenak-zentzu-guztia-galtzen-duenean/index.html",
  "es/escritos/index.html",
  "es/escritos/pedagogias-para-la-derrota/index.html",
  "es/escritos/llevar-el-fuego-aunque-no-sirva-para-nada/index.html",
  "es/escritos/el-espejo-incomodo/index.html",
  "es/escritos/la-historia-no-tiene-piloto-automatico/index.html",
  "musika-bila/index.html",
  "es/en-busca-de-musica/index.html"
];

const root = process.cwd();
const errors = [];
const cache = new Map();
const analyticsToken = "26b025c6de7549498e0cd169049f63c6";
const analyticsTokens = new Map();

async function load(file) {
  const absolute = resolve(root, file);

  if (!cache.has(absolute)) {
    cache.set(absolute, await readFile(absolute, "utf8"));
  }

  return cache.get(absolute);
}

async function resolveTarget(page, reference) {
  const [withoutFragment, fragment = ""] = reference.split("#", 2);
  const pathPart = withoutFragment.split("?", 1)[0];
  let target = pathPart ? resolve(root, dirname(page), pathPart) : resolve(root, page);

  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      target = resolve(target, "index.html");
    }
    await access(target);
  } catch {
    return { error: `destino inexistente: ${reference}` };
  }

  if (fragment && extname(target) === ".html") {
    const targetHtml = await load(target);
    const decodedFragment = decodeURIComponent(fragment);
    const idPattern = new RegExp(`\\bid=["']${decodedFragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}["']`);

    if (!idPattern.test(targetHtml)) {
      return { error: `fragmento inexistente: ${reference}` };
    }
  }

  return { target };
}

for (const page of pages) {
  const html = await load(page);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  const h1Count = headings.filter((level) => level === 1).length;

  if (h1Count !== 1) {
    errors.push(`${page}: contiene ${h1Count} elementos h1`);
  }

  if (new Set(duplicates).size > 0) {
    errors.push(`${page}: IDs duplicados: ${[...new Set(duplicates)].join(", ")}`);
  }

  headings.forEach((level, index) => {
    if (index > 0 && level > headings[index - 1] + 1) {
      errors.push(`${page}: salto de encabezado h${headings[index - 1]} → h${level}`);
    }
  });

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt="[^"]*"/i.test(image[0])) {
      errors.push(`${page}: imagen sin atributo alt`);
    }
  }

  const analyticsScripts = [
    ...html.matchAll(/<script\b[^>]*\bsrc=["']https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js["'][^>]*>\s*<\/script>/gi)
  ];

  if (analyticsScripts.length !== 1) {
    errors.push(`${page}: contiene ${analyticsScripts.length} beacons de Cloudflare Web Analytics`);
  } else {
    const script = analyticsScripts[0][0];
    const configMatch = script.match(/\bdata-cf-beacon='([^']+)'/i);

    if (!/\btype=["']module["']/i.test(script)) {
      errors.push(`${page}: el beacon de Cloudflare no usa type="module"`);
    }

    if (!configMatch) {
      errors.push(`${page}: el beacon de Cloudflare no contiene data-cf-beacon`);
    } else {
      try {
        const config = JSON.parse(configMatch[1]);

        if (typeof config.token !== "string" || !/^[a-f0-9]{32}$/i.test(config.token)) {
          errors.push(`${page}: token de Cloudflare Web Analytics inválido`);
        } else if (config.token !== analyticsToken) {
          errors.push(`${page}: el token de Cloudflare no coincide con el sitio configurado`);
        } else {
          analyticsTokens.set(page, config.token);
        }
      } catch {
        errors.push(`${page}: data-cf-beacon no contiene JSON válido`);
      }
    }

    const scriptPosition = html.indexOf(script);
    const bodyEndPosition = html.lastIndexOf("</body>");

    if (scriptPosition === -1 || bodyEndPosition === -1 || scriptPosition > bodyEndPosition) {
      errors.push(`${page}: el beacon de Cloudflare no está antes de </body>`);
    }
  }

  for (const attribute of html.matchAll(/\b(href|src|srcset)="([^"]+)"/gi)) {
    const references = attribute[1].toLowerCase() === "srcset"
      ? attribute[2].split(",").map((candidate) => candidate.trim().split(/\s+/, 1)[0])
      : [attribute[2]];

    for (const reference of references) {
      if (/^(?:https?:|mailto:|tel:|data:)/i.test(reference) || reference.startsWith("#")) {
        continue;
      }

      const result = await resolveTarget(page, reference);
      if (result.error) {
        errors.push(`${page}: ${result.error}`);
      }
    }
  }
}

if (new Set(analyticsTokens.values()).size > 1) {
  errors.push("Cloudflare Web Analytics: las páginas no comparten el mismo token");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`OK: estructura, accesibilidad, rutas y ${analyticsTokens.size} beacons de Cloudflare verificados.`);
}
