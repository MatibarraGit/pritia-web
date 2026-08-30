# Pritia

E-commerce de electrodomésticos, herramientas y artículos para el hogar, en producción en **[pritia.com.ar](https://pritia.com.ar)**.

Es una tienda real, con catálogo, carrito, simulador de cuotas conectado a Mercado Pago y un panel de administración propio para gestionar productos, precios e inventario. Construido de punta a punta con Next.js 16 (App Router) y React 19.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) · React 19 |
| Lenguaje | TypeScript 5 |
| Base de datos | PostgreSQL vía Prisma 6 (+ Accelerate) |
| Autenticación | better-auth (email/password, sesiones en DB) |
| Estado de cliente | Zustand |
| Estilos | Tailwind CSS 4 · Radix UI primitives · shadcn/ui |
| Imágenes | Cloudinary (upload + transformaciones on-the-fly) |
| Integraciones | API de Mercado Pago (cuotas y emisores) · n8n (webhooks) |
| Deploy | Vercel |

Node 22 · gestor de paquetes: pnpm.

---

## Arquitectura

El proyecto se organiza en tres dominios separados por **route groups** de Next.js, cada uno con su propio layout:

```
src/app/
├── (shop)/          Tienda pública — home, catálogo, detalle, búsqueda, favoritos
├── (protected)/     Panel de administración — requiere sesión
├── (auth)/          Login
└── api/             API interna (route handlers)
```

### Flujo de una request

```
Browser
   │
   ▼
proxy.ts ──────────► Corta acá si la ruta es privada y no hay sesión
   │                 (protege /admin, /auth y toda mutación sobre /api)
   ▼
Server Component / Route Handler
   │
   ▼
src/services/  ────► Capa de acceso a datos: única puerta a la API y a terceros
   │
   ├──► Prisma ──► PostgreSQL
   ├──► Cloudinary
   └──► Mercado Pago
```

### Capas

**`src/proxy.ts`** — Middleware de borde (`proxy.ts` es el nombre que Next 16 usa para el antiguo `middleware.ts`). Es el control de acceso central: deja pasar los `GET` públicos de `/api` y el login, y exige sesión válida para todo lo demás bajo `/admin`, `/auth` y cualquier mutación de la API. Las rutas sensibles además revalidan la sesión por su cuenta, para no depender de una sola capa.

**`src/app/api/`** — Route handlers agrupados por recurso (`products`, `categories`, `providers`, `newsletter`, `mercado-pago`). Cada endpoint valida su input y devuelve errores tipados con mensajes en español. Las consultas de catálogo usan SQL crudo parametrizado con las template tags de Prisma, para poder aprovechar extensiones de PostgreSQL que el query builder no expone.

**`src/services/`** — Capa intermedia entre la UI y los datos. Los componentes nunca hacen `fetch` sueltos ni hablan con Prisma directamente: importan desde acá. Todo pasa por un cliente HTTP genérico (`api-client.ts`) que unifica el manejo de errores y los mensajes de éxito en un único tipo `ActionResponse`.

**`src/contexts/`** — Stores de Zustand, uno por dominio (carrito, filtros, favoritos, orden, selección múltiple, toasts, sidebar del admin). Se prefirió un store por responsabilidad antes que uno global, para que cada componente se suscriba solo a lo que necesita y no re-renderice de más.

**`src/components/` · `src/layout/`** — Componentes agrupados por dominio (`product`, `products`, `cart`, `admin`, `forms`, `carousels`…), sobre una base de primitivas en `ui/` construidas con Radix.

**`src/hooks/` · `src/utils/` · `src/libs/`** — Hooks reutilizables (paginación, búsqueda con debounce, media queries), helpers puros (formateo de precios y fechas, slugs, normalización de texto) y clientes de servicios externos.

### Modelo de datos

Sobre PostgreSQL, con las extensiones `pg_trgm`, `unaccent` y `pgcrypto` habilitadas. Las entidades centrales son `products`, `categories`/`subcategories`, `providers` y `purchase_orders`/`purchase_order_items`, más `product_reviews`, `product_questions`, `newsletter_emails` y las tablas de sesión de better-auth.

---

## Decisiones técnicas que vale la pena mirar

**Búsqueda con tolerancia a errores de tipeo.** El buscador no es un `LIKE`. Combina `unaccent` (para que "climatizacion" encuentre "climatización") con `WORD_SIMILARITY` de `pg_trgm` para tolerar errores de tipeo, y ordena los resultados por una cascada de relevancia con `CASE`: primero coincidencia exacta de ID, después nombre exacto, después palabra completa, y recién al final coincidencia parcial. Está en [`api/products/route.ts`](src/app/api/products/route.ts).

**Optimización de imágenes sin pasar por el optimizador de Next.** [`utils/cloudinaryUrl.ts`](src/utils/cloudinaryUrl.ts) inyecta transformaciones directamente en la URL de entrega (`f_auto` para servir AVIF/WebP según el navegador, `q_auto` para comprimir según contenido, `c_limit` para no agrandar nunca). Es idempotente y devuelve intactas las URLs que no son de Cloudinary. Genera además `srcset` 1x/2x para que el navegador baje una sola variante. Como Cloudinary ya es un CDN con cache inmutable, saltear `/_next/image` evita un salto de red por imagen.

**Fuentes variables.** Los seis pesos tipográficos del sitio se sirven desde dos archivos `.woff2` variables en lugar de siete estáticos, declarando cada peso como un `@font-face` sobre el mismo archivo.

**Simulador de cuotas.** Consulta la API de Mercado Pago por medio de pago y banco emisor, y parsea los labels de CFT/TEA que la API argentina devuelve como strings concatenados (`"CFT_...|TEA_..."`) para mostrar el costo financiero real. El access token vive solo del lado del servidor. Ver [`services/mercado-pago.ts`](src/services/mercado-pago.ts).

**Panel de admin con dos vistas.** `/admin/products` funciona como router entre un panel de escritorio (tabla densa con edición inline y acciones masivas) y uno móvil, en vez de forzar una tabla responsive que no funciona bien en ninguno de los dos tamaños.

**SEO.** `sitemap.ts` y `robots.ts` generados dinámicamente desde el catálogo, con metadata por página y Open Graph.

---

## Cómo correrlo

```bash
pnpm install
```

Creá un `.env` en la raíz:

```bash
# URL Base
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# URL para consultas a la API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# User && Password && Host && Port && DB
DATABASE_URL="postgresql://usuario:password@host:5432/db"

# Para operaciones generales con Better Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLODUINARY_API_KEY="..."
CLODUINARY_API_SECRET="..."

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="..."
```

Aplicá el schema y levantá el server:

```bash
pnpm prisma db push
pnpm dev
```

> [!IMPORTANT]
> **El schema de Prisma no describe la base completa.**
>
> Este proyecto se diseñó en SQL primero y el schema se obtuvo después por introspección (`prisma db pull`). Como consecuencia, hay lógica que vive en la base y que `db push` **no** puede recrear:
>
> - **Triggers.** `products.product_slug` se genera del lado de la base a partir del nombre del producto: la aplicación nunca le asigna un valor, solo lo lee. `db push` crea la columna pero no el trigger, así que en una base nueva los slugs quedan en `NULL` y `POST /api/products` falla con un 400 engañoso ("probablemente ya exista un producto con ese nombre").
> Solución: hay que crear el trigger a mano.
> - **Extensiones.** El catálogo depende de `pg_trgm`, `unaccent` y `pgcrypto`. Estas sí las maneja `db push`, porque el generator tiene activado el preview feature `postgresqlExtensions`, pero conviene verificarlas con `\dx` si la búsqueda no devuelve resultados.
>
> Pendiente: versionar el DDL completo en `prisma/migrations/` para que el setup sea reproducible de punta a punta.

---

## Estado

En producción y en desarrollo activo.

---

Desarrollado por **Matías Ibarra** — [pritia.com.ar](https://pritia.com.ar)
