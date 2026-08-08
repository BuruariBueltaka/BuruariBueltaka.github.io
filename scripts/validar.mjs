import { access, readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";

const pages = [
  "index.html",
  "es/index.html",
  "idatziak/historiak-ez-du-pilotu-automatikorik/index.html",
  "es/escritos/la-historia-no-tiene-piloto-automatico/index.html",
  "musika-bila/index.html",
  "es/en-busca-de-musica/index.html"
];

const root = process.cwd();
const errors = [];
const cache = new Map();

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

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("OK: estructura, encabezados, alt, IDs y rutas relativas verificados.");
}
