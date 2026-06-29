# InventarioApp

Sistema de gestión de inventario construido con Angular 22, pensado como proyecto de aprendizaje práctico para dominar Signals, Signal Forms, arquitectura híbrida NgModule/Standalone, y patrones de UI reales (drawers, query params como fuente de verdad, formularios con validación y estados de carga).

Consume la API REST [`inventario-api`](https://github.com/JeanHaro/inventario-api), un backend en Express + TypeScript construido en paralelo a este proyecto.

## Stack técnico

- **Angular 22** — NgModule + componentes Standalone de forma híbrida (los componentes compartidos en `shared/` son standalone; los componentes de cada feature son NgModule)
- **Signals** — `signal`, `computed`, `model`, `input`, `output`, `effect`, `viewChild`, `toSignal`
- **Signal Forms** (`@angular/forms/signals`) — validación de formularios (`required`, `min`, `validate` personalizado)
- **rxResource** — búsqueda de productos combinando múltiples endpoints (`forkJoin` + `map`)
- **Query params como estado de UI** — los drawers (detalle, edición, creación) se controlan completamente vía URL, no con signals booleanos sueltos, permitiendo deep-linking, refresh seguro, y navegación con el botón "atrás" del navegador
- **pnpm** como package manager
- **SCSS** con metodología BEM
- **FontAwesome** para iconografía

## Estructura del proyecto

```
src/app/
├── dashboard/                  # Layout principal (sidebar, header, footer)
│   └── layout/
│       ├── header/             # Búsqueda, notificaciones (dropdown), config
│       └── sidebar/             # Navegación, menú de perfil
│
├── features/
│   ├── home/                   # Página de inicio (pendiente de desarrollo)
│   │
│   ├── products/                # Módulo principal — gestión de inventario
│   │   ├── components/          # Piezas embebidas en la vista de listado
│   │   │   ├── products-filters/  # Tabs de filtro por estado
│   │   │   ├── products-table/    # Tabla con ordenamiento, selección, variantes expandibles
│   │   │   └── products-tools/    # Buscador + botón "Agregar producto"
│   │   │
│   │   ├── drawers/              # Paneles laterales (side drawers), cada uno con su propia ruta vía query params
│   │   │   ├── product-detail/    # Ver/editar producto — incluye tabs de Variantes e Imágenes
│   │   │   │   └── components/
│   │   │   │       ├── product-variants-panel/  # Filtro, orden y listado de variantes del producto
│   │   │   │       └── product-images-panel/    # Galería de imágenes con subida/eliminación
│   │   │   ├── product-form/      # Crear producto nuevo
│   │   │   ├── variant-detail/    # Ver/editar una variante — incluye historial de actividad (timeline)
│   │   │   └── variant-form/      # Crear variante nueva (pendiente)
│   │   │
│   │   ├── models/                # Tipos e interfaces del dominio
│   │   └── services/              # Comunicación con la API
│   │
│   ├── profile/                  # Perfil de usuario (pendiente de desarrollo)
│   ├── reports/                  # Dashboard de reportes con stats y tabla
│   └── settings/                 # Configuración (pendiente de desarrollo)
│
└── shared/
    ├── components/
    │   └── select/                # Dropdown personalizado reutilizable (standalone)
    └── pipes/
        └── compact-number/        # Formatea números grandes (precio/stock) de forma compacta
```

## Funcionalidades implementadas

### Productos
- Listado con tabla ordenable (3 estados de orden: asc → desc → defecto), filtrable por estado, con búsqueda combinando nombre, categoría, marca y etiquetas
- Selección múltiple con acciones masivas (archivar/desarchivar)
- Drawer de detalle con modo de edición inline (Signal Forms + validación + estados de carga)
- Drawer de creación de producto
- Archivar/desarchivar con resolución automática de estado según stock de variantes
- Galería de imágenes con subida (validación de tipo/tamaño/cantidad), preview y eliminación

### Variantes
- Listado dentro del detalle del producto, con su propio filtro y ordenamiento
- Drawer de detalle con modo de edición (incluye imagen propia con preview "hover to change")
- Archivar/desarchivar independiente del producto
- Historial de actividad en formato timeline (actualmente con datos de muestra — pendiente de conectar al backend)

### Navegación de drawers vía query params
Cada drawer se controla con parámetros propios e independientes en la URL, permitiendo combinaciones correctas sin que un drawer "filtre" hacia otro al cerrarse:

| Parámetro | Controla |
|---|---|
| `id` | Drawer de detalle de producto explícitamente abierto |
| `modo=editar` | Producto abierto directo en modo edición |
| `productoId` + `varianteId` | Identifica la variante seleccionada (los ids de variante no son únicos globalmente, se resetean por producto) |
| `varModo=editar` | Variante abierta directo en modo edición |

Esto permite, por ejemplo, abrir el detalle de una variante directamente desde la tabla (sin que aparezca el producto detrás) o desde dentro del detalle del producto (donde sí debe volver a él al cerrar) — todo derivado de la URL, sin signals booleanos que deban "recordarse" manualmente.

### Componentes compartidos
- `Select` — dropdown personalizado con soporte de badges de color, validación visual de error, y cierre automático al hacer click afuera (vía `@HostListener` + `viewChild`)
- `compactNumber` — pipe para mostrar precios y stock grandes de forma abreviada (ej. `1.5M`, `10MIL`)

## Pendiente

- [ ] Autenticación: login y vinculación de cuenta de Google (solo post-login)
- [ ] Registro de usuarios (exclusivo desde el panel admin)
- [ ] Perfil de usuario
- [ ] Configuraciones (Settings)
- [ ] Reportes/Analytics conectado al backend con mejoras de estructura
- [ ] Notificaciones conectadas al backend (actualmente con datos de muestra)
- [ ] Historial de variantes conectado al backend (requiere event sourcing del lado de la API)
- [ ] Crear variantes desde el formulario (`variant-form`)
- [ ] Estructura y contenido de la página Home
- [ ] Asistente con IA integrado: creación de productos/variantes por lenguaje natural, y consultas sobre inventario y analíticas
- [ ] Migración del backend (`inventario-api`) a una arquitectura DDD con Event Sourcing
- [ ] Integración con un ecommerce que consuma el mismo backend de inventario

## Backend

API: [`inventario-api`](https://github.com/JeanHaro/inventario-api) — Express + TypeScript. Actualmente con persistencia simple en archivo JSON; planeada una migración a arquitectura DDD con Event Sourcing para servir tanto a este panel de administración como a un futuro ecommerce conectado al mismo inventario.

## Desarrollo

```bash
pnpm install
ng serve
```

La aplicación queda disponible en `http://localhost:4200/`.

```bash
ng test     # Tests unitarios con Vitest
ng build    # Build de producción
```
