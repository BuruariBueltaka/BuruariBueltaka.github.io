# Archivo personal de Luken San Sebastián Alkorta

Sitio estático bilingüe listo para GitHub Pages. Euskara es la lengua principal y castellano ofrece el contenido equivalente. No usa frameworks, dependencias externas ni proceso de compilación.

Sitio público: <https://buruaribueltaka.github.io/>

## Estructura

```text
.
├── .gitignore
├── README.md
├── index.html
├── idatziak
│   └── historiak-ez-du-pilotu-automatikorik
│       └── index.html
├── musika-bila
│   └── index.html
├── es
│   ├── index.html
│   ├── en-busca-de-musica
│   │   └── index.html
│   └── escritos
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
- Los artículos equivalentes se relacionan con `hreflang`.
- `Musika bila` y `En busca de música` son rutas bilingües equivalentes preparadas para su primer contenido.
- La fecha de publicación incorporada es el 8 de agosto de 2026.

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

## Publicación en GitHub Pages

Repositorio: <https://github.com/BuruariBueltaka/BuruariBueltaka.github.io>.

La publicación utiliza la rama `main` y la carpeta `/ (root)`. Tras integrar cambios mediante pull request, GitHub Pages vuelve a desplegar automáticamente el sitio.

Comprobación posterior a cada despliegue:

1. Abrir las portadas en euskara y castellano.
2. Abrir las dos versiones del artículo y sus imágenes editoriales distintas.
3. Abrir `Musika bila` y `En busca de música`.
4. Comprobar las siete fotografías y los enlaces a los originales.
5. Ejecutar `node scripts/validar.mjs` antes de crear el pull request.

Todas las rutas internas son relativas y funcionan desde la raíz `https://buruaribueltaka.github.io/`.
