# 6. Informe de ejecución de pruebas — SIGEM

**Versión probada:** 1.1 · **Fecha de ejecución:** 6 de octubre de 2026 · **Ejecutado por:** equipo de desarrollo (pruebas internas)

## 6.1 Resumen

| Indicador | Valor |
|---|---|
| Casos automatizados diseñados | **150** |
| Ejecuciones (incluye variantes de datos y los 3 roles) | **186** |
| Aprobadas | **186 (100 %)** |
| Fallidas | 0 |
| Defectos encontrados en pruebas internas | 17 |
| Defectos corregidos y cubiertos por una prueba de regresión | 17 |
| Defectos abiertos | 0 |
| Cobertura de código de la lógica de negocio (`logica.js`) | **94.9 % de líneas · 99 % de funciones** |

## 6.2 Resultados por tipo de prueba

| Tipo | Herramienta | Casos | Ejecuciones | Aprobadas | Resultado |
|---|---|:---:|:---:|:---:|:---:|
| Funcionales (unidad) | Jest | 90 | 100 | 100 | ✅ |
| Integración | Jest | 4 | 17 | 17 | ✅ |
| Seguridad (unidad) | Jest | 19 | 30 | 30 | ✅ |
| Sistema | Playwright | 11 | 11 | 11 | ✅ |
| Aceptación | Playwright | 1 (13 pasos) | 1 | 1 | ✅ |
| Regresión | Playwright | 7 | 9 | 9 | ✅ |
| Usabilidad (escritorio y móvil) | Playwright | 11 | 11 | 11 | ✅ |
| Seguridad (interfaz) | Playwright | 7 | 7 | 7 | ✅ |
| **Total** | | **150** | **186** | **186** | ✅ |

Además, la suite completa se ejecuta en **GitHub Actions** en cada cambio que se sube al repositorio (pestaña *Actions*), lo que funciona como prueba de regresión continua.

## 6.3 Cobertura de código

Obtenida con `npm run test:coverage` sobre los módulos probados con pruebas unitarias e integración:

| Archivo | Sentencias | Ramas | Funciones | Líneas |
|---|:---:|:---:|:---:|:---:|
| `src/js/logica.js` | 87.3 % | 77.3 % | 99.0 % | 94.9 % |
| `src/js/datos-demo.js` | 97.3 % | 71.4 % | 100 % | 96.6 % |
| **Total** | **88.0 %** | **77.1 %** | **99.1 %** | **95.0 %** |

La interfaz (`app.js`) se cubre con las pruebas de sistema, aceptación, regresión y usabilidad en el navegador.

## 6.4 Entorno

| Elemento | Versión |
|---|---|
| Node.js | 20 (CI) / 22 (local) |
| Jest | 29.7 |
| Playwright | 1.63 – Chromium |
| Perfiles de navegador | Escritorio 1280×720 · Móvil Pixel 5 (393×851) |
| Zona horaria | America/Guatemala |

## 6.5 Defectos encontrados y corregidos

Defectos detectados durante las pruebas internas, antes de entregar el sistema al grupo evaluador. Cada corrección quedó protegida por al menos un caso automatizado para evitar que el defecto regrese.

| ID | Descripción | Severidad | Característica ISO 25010 | Caso que lo verifica | Estado |
|---|---|:---:|---|---|:---:|
| DEF-01 | Los datos de ejemplo tenían fechas fijas (septiembre 2026): el panel del técnico no mostraba órdenes "de hoy", la agenda aparecía vacía y los indicadores del mes daban Q 0.00. | Alta | Adecuación funcional | CP-REG-02, CP-REG-03, CP-UNI-86 | ✅ Corregido |
| DEF-02 | "Hoy" se calculaba en hora UTC: después de las 18:00 en Guatemala el sistema tomaba la fecha del día siguiente; la bitácora mostraba la hora con 6 horas de diferencia. | Media | Corrección funcional | CP-UNI-90, CP-SEG-15 | ✅ Corregido |
| DEF-03 | El buscador global permitía al Técnico ver clientes, equipos y facturas (información fuera de su rol). | **Crítica** | Seguridad – Confidencialidad | CP-SEG-23 | ✅ Corregido |
| DEF-04 | El Técnico podía abrir órdenes asignadas a otros técnicos. | Alta | Seguridad – Confidencialidad | CP-SEG-23 | ✅ Corregido |
| DEF-05 | Se podía marcar una orden como "Finalizada" desde el formulario de edición, sin pasar por el panel técnico: no se descontaba inventario ni se generaba reporte. | Alta | Seguridad – Integridad | CP-UNI-28, CP-REG-05 | ✅ Corregido |
| DEF-06 | Se podía cambiar manualmente una factura a "Pagada" aunque tuviera saldo pendiente. | Alta | Seguridad – Integridad | CP-UNI-54 | ✅ Corregido |
| DEF-07 | Se podía editar o rechazar una cotización que ya había generado una orden de trabajo, alterando los montos a facturar. | Media | Pertinencia funcional | CP-UNI-17, CP-UNI-18 | ✅ Corregido |
| DEF-08 | Al generar una orden desde una cotización se programaba siempre a las 08:00 sin validar la agenda, creando choques de horario. | Media | Corrección funcional | CP-UNI-33, CP-INT-04 | ✅ Corregido |
| DEF-09 | Agregar el mismo repuesto en dos líneas permitía consumir más unidades de las existentes (inventario negativo). | Media | Corrección funcional | CP-UNI-36, CP-INT-02 | ✅ Corregido |
| DEF-10 | Las líneas tipo "Materiales" de cotizaciones nuevas no se sumaban a los costos de rentabilidad. | Media | Corrección funcional | CP-UNI-87 | ✅ Corregido |
| DEF-11 | La rentabilidad consideraba el IVA como ingreso de la empresa, inflando la utilidad y el margen. | Media | Corrección funcional | CP-INT-01 (paso 13), CP-UNI-77 | ✅ Corregido |
| DEF-12 | Faltaban validaciones: NIT y serie duplicados, correo y teléfono con formato inválido, cantidades negativas, descuento fuera de 0–100 %, contraseña corta. | Media | Protección contra errores | CP-UNI-08 a 12, CP-UNI-58 a 67, CP-SEG-16, CP-SEG-17 | ✅ Corregido |
| DEF-13 | Un usuario creado con rol Técnico no tenía técnico de campo vinculado y su panel no cargaba. | Media | Adecuación funcional | CP-UNI-89, CP-REG-07 | ✅ Corregido |
| DEF-14 | "Mi perfil" mostraba "No tiene permisos" a los roles Técnico y Administrativo. | Baja | Operabilidad | CP-REG-04 | ✅ Corregido |
| DEF-15 | La pantalla de inicio de sesión no era usable en teléfonos (columnas comprimidas y contenido cortado). | Alta | Inclusividad (responsive) | CP-USA-01 | ✅ Corregido |
| DEF-16 | El reporte CSV se descargaba sin nombre ni extensión ("download") cuando el nombre tenía tildes. | Media | Corrección funcional | CP-SIS-08 | ✅ Corregido |
| DEF-17 | El estado "Anulada" de facturas se mostraba en gris, igual que estados neutros. | Baja | Compromiso del usuario | CP-USA-13 | ✅ Corregido |

### Distribución por severidad

| Crítica | Alta | Media | Baja | Total |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 5 | 9 | 2 | 17 |

## 6.6 Conclusión

La versión 1.1 de SIGEM **cumple los criterios de salida** del plan de pruebas: el 100 % de los casos automatizados se aprobó, los 21 requerimientos funcionales y 6 no funcionales tienen cobertura de pruebas (ver [05-matriz-de-trazabilidad.md](05-matriz-de-trazabilidad.md)) y no hay defectos críticos ni altos abiertos.

Queda pendiente la **evaluación independiente** por el grupo evaluador con los casos manuales de la Parte A del documento de casos de prueba, en especial la lista heurística de usabilidad (CP-USA-20 a 30), cuyos resultados dependen de la percepción del usuario.
