# TailorX — Manual de Desarrollo (Frontend)

Fecha: 2025-12-16

## Objetivo
Este manual permite que un/a dev levante el frontend de TailorX en local, entienda cómo se conecta con la API, y tenga una guía rápida de los archivos/funciones más importantes (auth, router, cliente HTTP, Google Sign-In).

---

## Requisitos
- Node.js **20 LTS**
- npm (incluido con Node)

> Recomendación: usa un gestor de versiones (Volta / nvm-windows) para fijar Node 20 en el equipo.

---

## Configuración de entorno
### 1) Variables de entorno
Crea un archivo `.env` en la raíz del proyecto (misma carpeta que `package.json`) tomando como base `.env.example`.

Variables:
- `VITE_API_BASE_URL`: Base URL del backend (incluye `/api`). Ejemplo: `http://localhost:3000/api`
- `VITE_GOOGLE_CLIENT_ID`: Client ID de Google Identity Services.

Archivo de ejemplo: `.env.example`.

### 2) Google Identity Services
El script de Google se carga en `index.html`:
- `<script src="https://accounts.google.com/gsi/client" async defer></script>`

Si el botón de Google no aparece, revisa:
- Que `VITE_GOOGLE_CLIENT_ID` exista y sea válido.
- Que el dominio/origen (`http://localhost:5173`) esté autorizado en Google Cloud Console.

---

## Instalación y ejecución
Desde la carpeta del frontend:

```powershell
npm install
npm run dev
```

Comandos disponibles (ver `package.json`):
- `npm run dev`: levanta Vite (por defecto `http://localhost:5173`)
- `npm run build`: typecheck (`vue-tsc`) + build de Vite
- `npm run preview`: preview del build

---

## Arquitectura (alto nivel)
- Vue 3 + Vue Router + Pinia.
- La app consume el backend vía Axios usando `VITE_API_BASE_URL`.
- La autenticación se hace con JWT (guardado en `localStorage`) y se adjunta en cada request.

---

## Archivos clave y qué hacen

### Entrada y bootstrap
- `src/main.ts`
  - Crea la app Vue, registra Pinia y el router, monta en `#app`.

- `src/App.vue`
  - Inicializa estado persistido al montar:
    - `authStore.initializeAuth()` (recupera `authToken` + `user` desde `localStorage`)
    - `cartStore.initializeCart()` (carrito persistido)
  - Renderiza `<router-view />` como layout principal.

### Router y seguridad de rutas
- `src/router/index.ts`
  - Define todas las rutas (`/catalogo`, `/login`, `/carrito`, etc.).
  - Protege rutas con `meta.requiresAuth`.
  - `router.beforeEach(...)`:
    - Si una ruta requiere auth y el usuario no está autenticado (`authStore.isAuthenticated`), redirige a `/login`.

### Auth (estado global)
- `src/stores/auth.ts`
  - Store Pinia con:
    - **state**: `user`, `token`, `loading`, `error`
    - **getters**:
      - `isAuthenticated`: true si hay `token` y `user`
      - `userName`: nombre completo o email
    - **acciones** (API):
      - `login(credentials)`: `POST /auth/login`
      - `register(credentials)`: `POST /auth/register`
      - `logout()`: `POST /auth/logout` (igual limpia el storage aunque falle)
      - `getCurrentUser()`: `GET /auth/me`
      - `initializeAuth()`: restaura sesión desde `localStorage`
      - `signInWithGoogle(credential)`: `POST /auth/google`
      - `updateProfile(data)`: `PUT /users/:id`
      - `uploadProfilePicture(file)`: `POST /users/:id/profile-picture` (multipart)
      - `deleteProfilePicture()`: `DELETE /users/:id/profile-picture`

### Cliente HTTP / API
- `src/lib/api.ts`
  - Crea una instancia Axios con:
    - `baseURL`: `import.meta.env.VITE_API_BASE_URL` (fallback `http://localhost:3000/api`)
  - **Interceptor de request**:
    - Si existe `authToken` en `localStorage`, agrega `Authorization: Bearer <token>`.
  - **Interceptor de response**:
    - Si llega `401`, limpia sesión (`authToken`, `user`) y redirige a `/login`.
  - Expone módulos de API:
    - `measurementsApi`, `designsApi`, `patternsApi`, `paymentsApi`, `ordersApi`, `addressesApi`.

### Google Sign-In (UI)
- `src/composables/useGoogleSignIn.ts`
  - `isGoogleLoaded`: detecta si la librería `window.google.accounts` está cargada.
  - `renderGoogleButton(elementId, callback, options?)`:
    - Inicializa GIS con `VITE_GOOGLE_CLIENT_ID`.
    - Renderiza el botón en un elemento del DOM.
    - Entrega el `credential` (JWT de Google) en `callback`, para enviarlo al backend mediante `authStore.signInWithGoogle()`.

---

## Catálogo de Views (pantallas)
Las rutas se definen en `src/router/index.ts`. Este catálogo describe qué hace cada view y qué piezas del estado global usa.

### Públicas
- `src/views/HomeView.vue` (ruta `/`)
  - Landing/marketing + CTA.
  - Usa `authStore.isAuthenticated` para mostrar CTA “ver catálogo” vs “iniciar sesión / crear cuenta”.

- `src/views/BodyTypeGuideView.vue` (ruta `/guia-tipos-cuerpo`)
  - Guía estática de tipos de cuerpo (no consume API).

- `src/views/CatalogoView.vue` (ruta `/catalogo`)
  - Lista diseños desde `catalogStore`.
  - Toggle “solo activos” (usa `catalogStore.showOnlyActive` / `filteredDesigns`).
  - Navega al detalle con `/catalogo/:id`.

- `src/views/DesignDetailView.vue` (ruta `/catalogo/:id`)
  - Carga detalle de diseño y medidas requeridas (vía `catalogStore`).
  - Carga patrones del usuario para ese diseño (vía `patternsStore`).
  - Botón “generar patrón”: llama `patternsStore.generatePattern(userId, designId)`.
    - Maneja caso `missing_measurements` y muestra un modal/estado “faltan medidas”.
  - Permite agregar al carrito el patrón generado (vía `cartStore.addToCart`).

- `src/views/LoginView.vue` (ruta `/login`)
  - Login email/clave: `authStore.login`.
  - Login Google: usa `useGoogleSignIn` → `authStore.signInWithGoogle`.
  - Respeta `?redirect=...` para volver a la ruta original tras login.

- `src/views/CreateAccountView.vue` (ruta `/crear-cuenta`)
  - Registro email/clave: `authStore.register` (incluye confirmación de password en UI).
  - Registro/login Google: `useGoogleSignIn` → `authStore.signInWithGoogle`.

- `src/views/PaymentConfirmationView.vue` (ruta `/payment/confirmation`)
  - Confirmación de pago desde Webpay.
  - Lee `token_ws` desde querystring y llama `paymentStore.confirmPayment(token_ws)`.
  - En éxito: limpia carrito (`cartStore.clearCart`) y ofrece navegación a órdenes.
  - Nota: esta ruta es pública (sin `requiresAuth`) para permitir el retorno del proveedor de pago.

### Protegidas (requieren JWT)
- `src/views/AccountView.vue` (ruta `/cuenta`)
  - Panel de cuenta: muestra datos del usuario.
  - Edita perfil: `authStore.updateProfile`.
  - Subir/eliminar foto: `authStore.uploadProfilePicture` / `authStore.deleteProfilePicture`.

- `src/views/UserMeasurementsView.vue` (ruta `/medidas`)
  - Gestión “manual” de medidas.
  - Carga tipos: `measurementsStore.fetchMeasurementTypes`.
  - Carga medidas del usuario: `measurementsStore.fetchUserMeasurements(userId)`.
  - Guarda en batch: `measurementsStore.saveMeasurements(userId, inputs)`.
  - Elimina medida: `measurementsStore.deleteMeasurement(id, userId)`.

- `src/views/AIMeasurementsView.vue` (ruta `/medidas/ia`)
  - Flujo “Medidas con IA” (simulado/heurístico en el FE): fotos + altura + género.
  - Mapea nombres de medidas a `measurement_type_id` y persiste con `measurementsStore.saveMeasurements`.
  - También entrega resultado de “tipo corporal” para guiar al usuario.

- `src/views/PatternListView.vue` (ruta `/patrones`)
  - Lista patrones del usuario, con filtros por tabs (draft/finalized/archived/all).
  - Acciones por patrón: finalizar/archivar/desarchivar/eliminar (`patternsStore.finalizePattern`, etc.).
  - Permite descargar SVG (la view decide cómo obtenerlo/mostrarlo; el backend expone `GET /patterns/:id/svg`).
  - Permite agregar al carrito (vía `cartStore.addToCart`).

- `src/views/PatternView.vue` (ruta `/patrones/:id`)
  - Detalle de patrón: carga con `patternsStore.fetchPatternById(id)`.
  - Renderiza `svg_data` si viene incluido, y ofrece descarga.
  - Agrega al carrito si corresponde.

- `src/views/CartView.vue` (ruta `/carrito`)
  - Manejo del carrito persistido (localStorage) vía `cartStore`.
  - Calcula totales y permite ajustar cantidades.
  - Checkout: llama `paymentStore.createPayment(cartItems, userId)` y redirige a Webpay con `paymentStore.redirectToPayment(url, token)`.

- `src/views/OrderListView.vue` (ruta `/mis-pedidos`)
  - Historial de pedidos del usuario.
  - Carga órdenes vía `ordersApi.getUserOrders(userId)` (API module de `src/lib/api.ts`).
  - Muestra items, estados y estados de pago.

- `src/views/AddressesView.vue` (ruta `/mis-direcciones`)
  - CRUD de direcciones.
  - Lista: `addressesApi.getUserAddresses()`.
  - Crear: `addressesApi.createAddress(...)`.
  - Eliminar: `addressesApi.deleteAddress(id)`.
  - Validación de formulario: `vee-validate` + `zod`.

---

## Catálogo de Stores (Pinia)
Los stores viven en `src/stores/*.ts` y encapsulan estado global + llamadas HTTP.

### `src/stores/auth.ts`
- Propósito: sesión y perfil.
- State: `user`, `token`, `loading`, `error`.
- Getters: `isAuthenticated`, `userName`.
- Acciones (API):
  - `login` → `POST /auth/login`
  - `register` → `POST /auth/register`
  - `logout` → `POST /auth/logout` (igual limpia storage aunque falle)
  - `getCurrentUser` → `GET /auth/me`
  - `signInWithGoogle` → `POST /auth/google`
  - `updateProfile` → `PUT /users/:id`
  - `uploadProfilePicture` → `POST /users/:id/profile-picture` (multipart)
  - `deleteProfilePicture` → `DELETE /users/:id/profile-picture`
- Persistencia: guarda `authToken` + `user` en `localStorage`; `initializeAuth()` los restaura.

### `src/stores/cart.ts`
- Propósito: carrito local (no depende del backend para persistir).
- State: `items`, `loading`.
- Getters: `itemCount`, `totalAmount`, `cartItems`.
- Acciones:
  - `addToCart(pattern)`: si falta info del diseño, hace fallback consultando `catalogStore.fetchDesignById(designId)`.
  - `removeFromCart`, `updateQuantity`, `clearCart`.
  - `initializeCart()` carga desde `localStorage` (`tailorx_cart`).

### `src/stores/catalog.ts`
- Propósito: catálogo de diseños.
- State: `designs`, `selectedDesign`, `loading`, `error`, `showOnlyActive`.
- Getters: `filteredDesigns`, `designCount`, `activeDesignCount`.
- Acciones (API):
  - `fetchDesigns` → `GET /designs`
  - `fetchActiveDesigns` → `GET /designs/active`
  - `fetchDesignById` → `GET /designs/:id`
  - `fetchDesignMeasurements` → `GET /designs/:id/measurements`

### `src/stores/addresses.ts`
- Propósito: direcciones del usuario autenticado.
- State: `addresses`, `loading`, `error`.
- Getters: `defaultAddress`, `hasAddresses`.
- Acciones (API):
  - `fetchAddresses` → `GET /user-addresses`
  - `createAddress` → `POST /user-addresses`
  - `updateAddress` → `PUT /user-addresses/:id`
  - `deleteAddress` → `DELETE /user-addresses/:id`
- Nota: al marcar una dirección como default, refresca el listado para mantener consistencia.

### `src/stores/measurements.ts`
- Propósito: tipos de medidas + medidas del usuario.
- State: `measurementTypes`, `userMeasurements`, `loading`, `error`.
- Getters: `getMeasurementByTypeId(typeId)`.
- Acciones (API):
  - `fetchMeasurementTypes` → `GET /measurement-types`
  - `fetchUserMeasurements(userId)` → `GET /user-measurements/user/:userId`
  - `saveMeasurements(userId, measurements[])` → `POST /user-measurements/batch`
  - `deleteMeasurement(id, userId)` → `DELETE /user-measurements/:id` + refresh

### `src/stores/patterns.ts`
- Propósito: patrones (listado, generación, estados).
- State: `patterns`, `selectedPattern`, `loading`, `error`, `generationProgress`.
- Getters: `draftPatterns`, `finalizedPatterns`, `archivedPatterns`.
- Acciones (API):
  - `fetchUserPatterns(userId)` → `GET /patterns/user/:userId`
  - `fetchPatternById(id)` → `GET /patterns/:id`
  - `generatePattern(userId, designId)` → `POST /patterns/generate`
    - Maneja respuesta de error especial: `missing_measurements`.
  - `finalizePattern(id)` → `PUT /patterns/:id/finalize`
  - `archivePattern(id)` → `PUT /patterns/:id/archive`
  - `unarchivePattern(id)` → `PUT /patterns/:id/unarchive`
  - `updatePattern(id, ...)` → `PUT /patterns/:id`
  - `deletePattern(id)` → `DELETE /patterns/:id`

### `src/stores/payment.ts`
- Propósito: iniciar/confirmar pagos (Webpay) y exponer estado en UI.
- State: `currentOrderId`, `currentPaymentToken`, `currentPaymentUrl`, `paymentStatus`, `loading`, `error`.
- Acciones (API):
  - `createPayment(cart, userId, returnUrl?)` → `POST /payments/create`
  - `confirmPayment(token)` → `PUT /payments/confirm/:token`
  - `getPaymentStatus(orderId)` → `GET /payments/order/:orderId`
- UI helper: `redirectToPayment(url, token)` construye un POST form con `token_ws`.

---

## Flujos principales

### Flujo de login (email/clave)
1. UI llama `authStore.login()`.
2. `login()` hace `POST /api/auth/login`.
3. Si `success`, guarda `authToken` + `user` en `localStorage`.
4. A partir de ahí, `src/lib/api.ts` adjunta el token automáticamente.

### Flujo de Google Sign-In
1. UI llama `renderGoogleButton(...)`.
2. GIS retorna `credential`.
3. La app envía el `credential` al backend (`POST /api/auth/google`).
4. Backend valida token, crea/actualiza usuario y devuelve JWT propio.

### Protección de rutas
- Para rutas con `meta.requiresAuth: true`, el guard del router envía a `/login` si no hay sesión.

---

## Troubleshooting

### `npm run dev` falla inmediatamente
Causas comunes:
- Dependencias no instaladas: ejecuta `npm install`.
- Versión de Node distinta a Node 20: valida con `node -v`.
- Cache/carpeta corrupta: borra `node_modules` y reinstala.

### 401 y redirección automática a /login
El interceptor en `src/lib/api.ts` hace esto cuando recibe `401`.
- Revisa que el backend esté corriendo y `VITE_API_BASE_URL` apunte bien.
- Revisa que el token no haya expirado.

### CORS
Si ves errores CORS en consola:
- Confirma que el backend permita `http://localhost:5173`.
- Verifica `FRONTEND_URL` en el backend si lo estás usando.

---

## Referencias
- Setup de autenticación: ver `AUTH_SETUP.md` (explica variables FE y endpoints de auth).
