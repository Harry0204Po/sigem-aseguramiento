# 2. Plan de pruebas — SIGEM

## 2.1 Objetivo

Verificar que SIGEM cumple sus requerimientos funcionales y las características de calidad **Adecuación funcional, Usabilidad (capacidad de interacción) y Seguridad** de la norma **ISO/IEC 25010:2023**, y facilitar que un grupo externo evalúe el sistema de forma independiente.

## 2.2 Enfoque

Las pruebas se diseñaron principalmente como **pruebas de caja negra**: se validan entradas y salidas de cada proceso sin depender de la implementación interna. Las técnicas usadas para derivar los casos fueron:

| Técnica | Dónde se aplicó |
|---|---|
| Partición de equivalencia | Datos válidos/inválidos en clientes, equipos, cotizaciones, pagos y usuarios |
| Análisis de valores límite | Descuento 0–100 %, pago igual / mayor al saldo, stock igual al mínimo, rango de 30 días, horas 23:59 / 24:00 |
| Tablas de decisión | Cambios de estado de cotización, factura y orden; permisos por rol |
| Transición de estados | Cotización → Orden → Finalizada → Factura → Pagada |
| Casos de uso | Flujo completo de 13 pasos (requerimiento 19) |

## 2.3 Niveles y tipos de prueba

| Tipo | Qué se verifica | Cómo | Herramienta | Prefijo |
|---|---|---|---|---|
| **Funcionales** | Que cada regla de negocio y cálculo produzca el resultado esperado | Automatizado sobre `logica.js` + casos manuales para el grupo evaluador | Jest · manual | `CP-UNI` · `CP-FUN` |
| **Integración** | Que los módulos funcionen juntos (cotización → orden → inventario → factura → pago → rentabilidad) | Automatizado | Jest | `CP-INT` |
| **Sistema** | El sistema completo en el navegador: formularios, filtros, alertas, validaciones, exportación | Automatizado | Playwright | `CP-SIS` |
| **Aceptación** | Que el usuario pueda completar el flujo de negocio de 13 pasos desde la interfaz | Automatizado + ejecución manual por el grupo evaluador | Playwright · manual | `CP-ACE` |
| **Regresión** | Que lo que ya funcionaba siga funcionando y que los defectos corregidos no regresen | Toda la suite se ejecuta en cada *push* con GitHub Actions | Jest + Playwright | `CP-REG` |
| **Usabilidad** | Navegación, retroalimentación, diseño responsive, prevención de errores | Automatizado (escritorio y móvil) + lista de verificación heurística | Playwright · manual | `CP-USA` |
| **Seguridad** | Autenticación, permisos por rol, confidencialidad, XSS, bitácora | Automatizado + manual | Jest · Playwright · manual | `CP-SEG` |

## 2.4 Entorno de pruebas

| Elemento | Detalle |
|---|---|
| Aplicación | https://USUARIO.github.io/REPOSITORIO/ (o `index.html` local) |
| Navegadores | Google Chrome / Microsoft Edge actualizados (escritorio); Chrome en Android |
| Resoluciones | 1280×800 (escritorio) y 393×851 (teléfono, Pixel 5) |
| Datos | Datos de demostración precargados (se restablecen al recargar) |
| Automatización | Node.js 20, Jest 29, Playwright |

## 2.5 Criterios de entrada y salida

**Entrada:** la aplicación está publicada, la suite automatizada pasa al 100 % en GitHub Actions y el grupo evaluador tiene acceso al enlace, al repositorio y a esta documentación.

**Salida:**
- 100 % de los casos automatizados aprobados.
- 100 % de los casos manuales de prioridad Alta ejecutados.
- Ningún defecto de severidad Crítica o Alta abierto.
- Defectos Medios y Bajos documentados con su decisión (corregir / aceptar).

## 2.6 Severidad de defectos

| Severidad | Criterio | Ejemplo |
|---|---|---|
| Crítica | Bloquea el flujo principal o expone información a quien no debe verla | No se puede finalizar ninguna orden; el técnico ve rentabilidad |
| Alta | Resultado incorrecto en cálculos o datos | Total de cotización mal calculado; inventario no se descuenta |
| Media | Funcionalidad secundaria falla o falta una validación | Se acepta un correo con formato inválido |
| Baja | Detalle visual o de redacción | Color de estado inconsistente, error ortográfico |

## 2.7 Cómo reportar defectos (grupo evaluador)

1. Identifique el caso de prueba (`docs/03-casos-de-prueba.md`) o describa el escenario.
2. Abra un *issue* en el repositorio con la plantilla **"Reporte de defecto"** (pestaña *Issues → New issue*), o envíelo por correo con los mismos campos.
3. Incluya: pasos para reproducir, datos usados, rol, resultado esperado, resultado obtenido, severidad y captura de pantalla.
4. Recuerde que **recargar la página reinicia los datos**: anote los pasos desde el inicio de sesión.

## 2.8 Ejecución de las pruebas automatizadas

```bash
npm install                      # una sola vez
npx playwright install chromium  # una sola vez (navegador para pruebas de sistema)

npm test                    # unitarias + integración
npm run test:unit           # solo unitarias
npm run test:integration    # solo integración
npm run test:coverage       # con reporte de cobertura (carpeta coverage/)
npm run test:e2e            # sistema, aceptación, regresión, seguridad y usabilidad
npm run test:all            # toda la suite
```

El resultado de la última ejecución está en [06-informe-de-ejecucion.md](06-informe-de-ejecucion.md).

## 2.9 Responsabilidades

| Rol | Responsable |
|---|---|
| Diseño y automatización de pruebas | Equipo de desarrollo (Grupo SIGEM) |
| Ejecución de pruebas manuales y exploratorias | Grupo evaluador asignado |
| Corrección de defectos y re-prueba | Equipo de desarrollo |
