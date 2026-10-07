# SIGEM · Sistema Integral de Gestión Electromecánica

![Pruebas](https://github.com/USUARIO/REPOSITORIO/actions/workflows/pruebas.yml/badge.svg)

Plataforma web para administrar una empresa de soporte técnico de **bombas de agua, motores eléctricos, paneles de control y variadores de frecuencia**: clientes, equipos, cotizaciones, órdenes de trabajo, panel del técnico, inventario, facturación, pagos, gastos, rentabilidad y reportes gerenciales.

Desarrollado con **HTML5 + CSS3 + JavaScript** (sin dependencias), con la lógica de negocio separada en un módulo probado con **Jest** y pruebas de sistema, aceptación, seguridad y usabilidad con **Playwright**.

Proyecto del curso **Aseguramiento de la Calidad de Software** · Universidad Mariano Gálvez de Guatemala · Campus Villa Nueva.

---

## 🔗 Acceso al sistema

**Demo en línea:** https://USUARIO.github.io/REPOSITORIO/

No requiere instalación. Las credenciales también están como **accesos rápidos** en la pantalla de inicio de sesión.

## Roles del sistema

| Rol | Acceso |
|---|---|
| **Administrador** | Acceso total: todos los módulos, rentabilidad, reportes, usuarios y bitácora |
| **Administrativo** | Clientes, equipos, cotizaciones, órdenes de trabajo, facturación y pagos |
| **Técnico** | Solo su panel: órdenes asignadas, ejecución del servicio, repuestos utilizados y reporte técnico |

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| `admin@sigem.com` | `123456` | Administrador |
| `administrativo@sigem.com` | `123456` | Administrativo |
| `tecnico@sigem.com` | `123456` | Técnico (Carlos Méndez) |
| `fruiz@sigem.com` | `123456` | Administrativo **inactivo** (debe ser rechazado) |

## Consideraciones para el grupo evaluador

- **Los datos son simulados y viven en memoria.** Al recargar la página (F5) todo vuelve al estado inicial. Para cambiar de usuario sin perder lo registrado, use *Cerrar sesión*.
- **Las fechas son relativas al día actual:** siempre habrá órdenes "de hoy", próximas y facturas vencidas.
- **Facturación simulada:** no tiene conexión con SAT/FEL ni validez fiscal.
- **Reporte PDF:** se genera con la impresión del navegador (*Guardar como PDF*).
- Los casos de prueba sugeridos están en [`docs/03-casos-de-prueba.md`](docs/03-casos-de-prueba.md) y los defectos se pueden reportar en *Issues → New issue → Reporte de defecto*.

## Flujo principal del negocio

1. Registrar cliente → 2. Registrar equipo → 3. Crear cotización → 4. Aprobar cotización → 5. Generar orden de trabajo → 6. Asignar técnico → 7. Técnico ejecuta el servicio → 8. Registrar repuestos → 9. Finalizar servicio → 10. Reporte técnico → 11. Generar factura → 12. Registrar pago → 13. Consultar rentabilidad.

Los pasos 7 a 9 se realizan con el rol **Técnico**; el resto con **Administrador**. El menú *Guía de la demo* explica cada paso y lleva directo al módulo.

---

## Ejecutar localmente

### Requisitos previos

- Un navegador moderno (Chrome, Edge o Firefox) — suficiente para **usar** el sistema.
- [Node.js 20+](https://nodejs.org/) — solo para **ejecutar las pruebas automatizadas**.

### 1. Clonar el repositorio

```bash
git clone https://github.com/USUARIO/REPOSITORIO.git
cd REPOSITORIO
```

### 2. Abrir la aplicación

Abra `index.html` con doble clic, o levante un servidor local:

```bash
npm install
npm start          # abre http://localhost:8080
```

### 3. Instalar el navegador para pruebas de sistema (una sola vez)

```bash
npx playwright install chromium
```

---

## Pruebas

```bash
# Unitarias + integración (Jest)
npm test

# Solo unitarias
npm run test:unit

# Solo integración
npm run test:integration

# Con reporte de cobertura (carpeta coverage/)
npm run test:coverage

# Sistema, aceptación, regresión, seguridad y usabilidad (Playwright)
npm run test:e2e

# Toda la suite
npm run test:all
```

La suite completa se ejecuta automáticamente en **GitHub Actions** con cada *push* (pestaña *Actions*).

### Tipos de prueba

| Tipo | Herramienta | Casos | Ubicación |
|---|---|:---:|---|
| Funcionales (unidad) | Jest | 90 | `tests/unit/` |
| Integración | Jest | 4 (17 pasos) | `tests/integration/` |
| Sistema | Playwright | 11 | `tests/e2e/sistema.spec.js` |
| Aceptación (flujo de 13 pasos) | Playwright | 1 | `tests/e2e/aceptacion-flujo.spec.js` |
| Regresión | Playwright + CI | 7 | `tests/e2e/regresion.spec.js` |
| Usabilidad (escritorio y móvil) | Playwright | 11 | `tests/e2e/usabilidad*.spec.js` |
| Seguridad | Jest + Playwright | 26 | `tests/unit/seguridad.test.js`, `tests/e2e/seguridad.spec.js` |
| **Total** | | **150 casos · 186 ejecuciones · 100 % aprobadas** | |

Cobertura de la lógica de negocio: **94.9 % de líneas**. Detalle en [`docs/06-informe-de-ejecucion.md`](docs/06-informe-de-ejecucion.md).

### Calidad según ISO/IEC 25010:2023

- **Adecuación funcional** — completitud, corrección y pertinencia: cálculos de cotización, facturación, pagos, inventario y rentabilidad verificados contra valores esperados; flujo completo de 13 pasos.
- **Usabilidad (capacidad de interacción)** — validaciones con mensajes claros, notificaciones, guía integrada, diseño responsive probado en escritorio y teléfono.
- **Seguridad** — autenticación con usuarios activos, control de acceso por rol (RBAC), protección contra XSS, bitácora de actividad.

Matriz completa en [`docs/04-matriz-iso-25010.md`](docs/04-matriz-iso-25010.md).

---

## Documentación

| Documento | Contenido |
|---|---|
| [01 · Documentación técnica](docs/01-documentacion-tecnica.md) | Arquitectura, roles, modelo de datos y reglas de negocio |
| [02 · Plan de pruebas](docs/02-plan-de-pruebas.md) | Enfoque, tipos de prueba, entorno y reporte de defectos |
| [03 · Casos de prueba](docs/03-casos-de-prueba.md) | Casos manuales para el evaluador y catálogo automatizado |
| [04 · Matriz ISO/IEC 25010](docs/04-matriz-iso-25010.md) | Subcaracterísticas, casos y resultados |
| [05 · Matriz de trazabilidad](docs/05-matriz-de-trazabilidad.md) | Requerimientos ↔ casos de prueba |
| [06 · Informe de ejecución](docs/06-informe-de-ejecucion.md) | Resultados, cobertura y defectos corregidos |

## Estructura del proyecto

```
REPOSITORIO/
├── index.html                  # Aplicación (punto de entrada)
├── assets/css/styles.css       # Estilos y diseño responsive
├── src/js/
│   ├── logica.js               # Reglas de negocio: validaciones, cálculos, RBAC
│   ├── datos-demo.js           # Datos simulados en memoria
│   └── app.js                  # Interfaz: vistas, formularios, navegación
├── tests/
│   ├── unit/                   # cotizaciones, ordenes, facturacion, seguridad, catalogos, utilidades
│   ├── integration/            # flujo-negocio
│   └── e2e/                    # sistema, aceptacion, regresion, seguridad, usabilidad
├── docs/                       # Documentación técnica y de pruebas
├── .github/
│   ├── workflows/pruebas.yml   # Integración continua
│   └── ISSUE_TEMPLATE/         # Plantilla de reporte de defectos
├── playwright.config.js
└── package.json
```

## Metodología

Desarrollo con **Scrum** e incrementos por módulo. Las pruebas se diseñaron principalmente como **caja negra** (partición de equivalencia, valores límite, tablas de decisión y transición de estados) en siete tipos: funcionales, integración, sistema, aceptación, regresión, usabilidad y seguridad.

## Integrantes — Grupo 3

| Nombre | Carné |
|---|---|
| Harry Eduardo Cardona Pérez | 5190-22-12305 |
| Pablo Alejandro Pérez Vásquez | 5190-22-10933 |
| William Fernando López | 5190-11-7240 |
