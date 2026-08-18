# Intereses y reflexiones personales — Luken San Sebastián Alkorta

Sitio estático bilingüe listo para GitHub Pages. Euskara es la lengua principal y castellano ofrece los contenidos que cuentan con traducción. No usa frameworks ni proceso de compilación. Las integraciones externas declaradas son el reproductor de Spotify de las páginas de música y Cloudflare Web Analytics.

Sitio público: <https://buruaribueltaka.github.io/>

## Estructura

```text
.
├── .gitignore
├── README.md
├── index.html
├── idatziak
│   ├── index.html
│   ├── historiak-ez-du-pilotu-automatikorik
│   │   └── index.html
│   ├── la-carretera-itxaropenak-zentzu-guztia-galtzen-duenean
│   │   └── index.html
│   └── ispilu-deserosoa
│       └── index.html
├── musika-bila
│   └── index.html
├── es
│   ├── index.html
│   ├── en-busca-de-musica
│   │   └── index.html
│   └── escritos
│       ├── index.html
│       ├── el-espejo-incomodo
│       │   └── index.html
│       └── la-historia-no-tiene-piloto-automatico
│           └── index.html
├── scripts
│   └── validar.mjs
└── assets
    ├── css
    │   └── styles.css
    ├── js
    │   └── main.js
    └── images
        ├── articles
        │   ├── la-carretera.jpg
        │   ├── los-desposeidos-historiak.png
        │   ├── los-desposeidos-historiak.webp
        │   └── los-desposeidos-historia.png
        ├── foto-01.jpeg
        ├── foto-02.jpeg
        ├── foto-03.jpeg
        ├── foto-04.jpeg
        ├── foto-05.jpeg
        ├── foto-06.jpeg
        ├── foto-07.jpeg
        └── previews
            ├── foto-01-hero.jpg
            ├── foto-01.jpg
            ├── foto-02.jpg
            ├── foto-03.jpg
            ├── foto-04.jpg
            ├── foto-05.jpg
            ├── foto-06.jpg
            └── foto-07.jpg
```

## Verlo en local

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

- Euskara: `http://127.0.0.1:8000/`
- Castellano: `http://127.0.0.1:8000/es/`

La comprobación local no necesita instalar paquetes:

```bash
node scripts/validar.mjs
```

## Idiomas y contenido

- `/` usa `lang="eu"` y es la versión predeterminada.
- `/es/` usa `lang="es"`.
- El selector `EU / ES` y todos los enlaces editoriales funcionan sin JavaScript.
- Los artículos equivalentes se relacionan con `hreflang`; un artículo sin traducción no declara una equivalencia inexistente.
- `/idatziak/` contiene el archivo completo en euskara y `/es/escritos/` solo los textos disponibles en castellano.
- `Musika bila` y `En busca de música` son rutas bilingües equivalentes e incluyen la misma lista pública de Spotify.
- La portada muestra únicamente el escrito más reciente. El archivo conserva los demás en orden cronológico inverso.
- Solo se publica una fecha cuando forma parte de los datos editoriales facilitados.

## Añadir escritos

1. Crear el artículo en `idatziak/<slug>/index.html` y añadirlo a `idatziak/index.html`.
2. Crear `es/escritos/<slug>/index.html` solo cuando exista una traducción real; añadirla entonces al archivo castellano.
3. Ordenar cada archivo del texto más reciente al más antiguo, sin inventar fechas ausentes.
4. Sustituir el destacado de la portada únicamente si el nuevo texto es el más reciente; no duplicar traducciones en una misma portada.
5. Añadir toda página nueva a la lista `pages` de `scripts/validar.mjs`.
6. Ejecutar `node scripts/validar.mjs` antes de publicar.

## Fotografías

Las siete fotografías originales se conservan como `foto-01.jpeg` a `foto-07.jpeg`. La portada y la galería cargan vistas previas ligeras; al activar una foto se abre el JPEG original a resolución completa.

Las copias publicables incluidas no conservan EXIF, GPS, modelo de cámara ni fecha de captura incrustada. Las fechas y lugares visibles son texto editorial y pueden modificarse en las dos portadas.

Para sustituir una fotografía:

1. Reemplazar el JPEG original conservando su nombre.
2. Exportar una copia JPEG de hasta 720 px de ancho en `assets/images/previews/` con el mismo número.
3. Para `foto-01`, exportar además `foto-01-hero.jpg` con un lado máximo de 1600 px.
4. Eliminar los metadatos de localización antes de publicar.
5. Actualizar `alt`, fecha, lugar, `width` y `height` en `index.html` y `es/index.html`.

`foto-02.jpeg` tiene 662 × 1177 px porque esa es la resolución del archivo recibido; no se amplía artificialmente.

## Compartir

- Los enlaces de intención de X funcionan con JavaScript desactivado.
- Con JavaScript se añade la URL exacta del bloque compartido.
- El control adicional usa Web Share cuando está disponible y, en caso contrario, permite copiar la URL.
- Todas las páginas enlazan los perfiles públicos [@LukenSanSebasti en X](https://x.com/LukenSanSebasti) y [@luken_san_sebastian en Instagram](https://www.instagram.com/luken_san_sebastian/).

## Analítica

- Cloudflare Web Analytics registra visitas, páginas vistas, rutas, referencias, país, dispositivo, navegador y métricas de rendimiento.
- El beacon se incluye una sola vez en cada HTML y usa el sitio `buruaribueltaka.github.io`.
- Cloudflare Web Analytics no instala cookies, no usa almacenamiento local ni crea perfiles individuales.
- Los datos se consultan en el panel de Cloudflare y pueden tardar varios minutos en aparecer.
- Los bloqueadores de contenido pueden impedir la medición, por lo que las cifras representan un mínimo observado.
- Toda página nueva debe incluir el mismo beacon antes de `</body>`; `scripts/validar.mjs` comprueba su presencia, configuración y token.

## Publicación en GitHub Pages

Repositorio: <https://github.com/BuruariBueltaka/BuruariBueltaka.github.io>.

La publicación utiliza la rama `main` y la carpeta `/ (root)`. Tras integrar cambios mediante pull request, GitHub Pages vuelve a desplegar automáticamente el sitio.

Comprobación posterior a cada despliegue:

1. Abrir las portadas en euskara y castellano.
2. Abrir los archivos `Idatziak` y `Escritos`, y comprobar sus enlaces y su orden.
3. Abrir cada artículo; verificar que solo aparecen los idiomas realmente disponibles.
4. Abrir `Musika bila` y `En busca de música`, incluido el reproductor y su enlace alternativo.
5. Comprobar las siete fotografías y los enlaces a los originales.
6. Ejecutar `node scripts/validar.mjs` antes de crear el pull request.

Todas las rutas internas son relativas y funcionan desde la raíz `https://buruaribueltaka.github.io/`.
