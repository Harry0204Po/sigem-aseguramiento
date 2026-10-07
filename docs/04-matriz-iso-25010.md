# 4. Matriz de calidad ISO/IEC 25010:2023 — SIGEM

SIGEM evalúa tres características del modelo de calidad de producto **ISO/IEC 25010:2023**. En la versión 2023 la característica *Usabilidad* se denomina **Capacidad de interacción**; aquí se usan ambos nombres.

Cada fila relaciona una subcaracterística con cómo la atiende el sistema, los casos de prueba que la verifican (ver [03-casos-de-prueba.md](03-casos-de-prueba.md)), el criterio de aceptación y el resultado obtenido.

---

## 4.1 Adecuación funcional

> Grado en que el producto proporciona funciones que satisfacen las necesidades declaradas e implícitas.

| Subcaracterística | Cómo se atiende en SIGEM | Casos de prueba | Criterio de aceptación | Resultado |
|---|---|---|---|---|
| **Completitud funcional** | Los 14 módulos y el flujo de 13 pasos del requerimiento están implementados; los datos de demostración cumplen las cantidades mínimas. | CP-ACE-01, CP-ACE-02, CP-INT-01, CP-UNI-82, CP-UNI-83, CP-REG-01, CP-SIS-01, CP-SIS-08, CP-SIS-11 · Matriz de trazabilidad (doc. 05) | 100 % de los requerimientos funcionales con al menos un caso aprobado | ✅ 21/21 requerimientos funcionales cubiertos |
| **Corrección funcional** | Cálculos de cotización, factura, pagos, saldos, rentabilidad e inventario implementados como reglas de negocio aisladas y redondeadas a centavos. | CP-UNI-01 a 06, CP-UNI-34, CP-UNI-42 a 56, CP-UNI-72, CP-UNI-74 a 77, CP-UNI-87, CP-UNI-88, CP-INT-01 a 03, CP-FUN-07, CP-FUN-08, CP-FUN-18, CP-FUN-19 | Resultados idénticos a los calculados manualmente (diferencia Q 0.00) | ✅ Aprobado |
| **Pertinencia funcional** | Cada paso del proceso habilita solo la acción siguiente que corresponde (por ejemplo, el botón *Generar orden* aparece solo en cotizaciones aprobadas; solo se factura una orden finalizada). | CP-UNI-30 a 32, CP-UNI-45, CP-UNI-47, CP-SIS-05, CP-REG-05, CP-FUN-09, CP-FUN-10 | Ninguna acción disponible fuera de su estado válido | ✅ Aprobado |

## 4.2 Capacidad de interacción (Usabilidad)

> Grado en que usuarios específicos pueden interactuar con el producto para lograr sus objetivos con efectividad, eficiencia y satisfacción.

| Subcaracterística | Cómo se atiende en SIGEM | Casos de prueba | Criterio de aceptación | Resultado |
|---|---|---|---|---|
| **Reconocibilidad de la adecuación** | Dashboard con indicadores del negocio; menú agrupado por área (Operación comercial, Campo, Finanzas, Sistema); nombre y subtítulo siempre visibles. | CP-SIS-01, CP-USA-12, CP-USA-15, CP-USA-21 | El evaluador identifica para qué sirve cada módulo sin explicación | ✅ Automatizado · ⏳ manual |
| **Aprendizabilidad** | *Guía de la demo* con el flujo de 13 pasos y botón "Ir" a cada módulo; terminología del negocio. | CP-USA-14, CP-USA-29, CP-ACE-02 | Un usuario nuevo completa el flujo usando solo la guía | ✅ Automatizado · ⏳ manual |
| **Operabilidad** | Formularios con listas desplegables, filtros y buscador global, acceso rápido por rol, navegación por teclado (Enter). | CP-SIS-02, CP-SIS-09, CP-USA-10, CP-USA-25, CP-USA-26 | Las tareas frecuentes se completan sin escribir códigos | ✅ Automatizado · ⏳ manual |
| **Protección contra errores del usuario** | Validaciones antes de guardar: obligatorios, formatos (correo, teléfono, hora), duplicados, montos, existencia, conflictos de agenda; los formularios no se cierran ante un error. | CP-SIS-03, CP-SIS-04, CP-SIS-07, CP-UNI-08 a 12, CP-UNI-25 a 29, CP-UNI-35 a 38, CP-UNI-50, CP-UNI-58 a 67, CP-FUN-03, CP-FUN-11, CP-FUN-14, CP-FUN-15, CP-FUN-20, CP-USA-24 | 0 operaciones inválidas aceptadas | ✅ Aprobado |
| **Compromiso del usuario** (estética) | Estilo empresarial azul/gris/blanco, íconos por módulo, estados con color, tarjetas e indicadores. | CP-USA-13, CP-USA-27 | Calificación promedio ≥ 4/5 en la lista heurística | ⏳ Evaluación manual |
| **Inclusividad** | Interfaz en español, diseño responsive para escritorio y teléfono, contraste alto en textos. | CP-USA-01 a 05, CP-USA-30 | Todas las tareas posibles en 393 px de ancho sin desplazamiento horizontal | ✅ Aprobado |
| **Asistencia al usuario** | Notificaciones de confirmación y error, recuadros de ayuda (`note-box`), alertas de stock bajo y facturas vencidas. | CP-USA-11, CP-SIS-06, CP-USA-20 | Toda acción produce retroalimentación visible | ✅ Aprobado |
| **Autodescriptividad** | Cada vista tiene título y descripción; mensajes de error que indican cómo corregir. | CP-USA-12, CP-USA-28 | Mensajes comprensibles sin documentación | ✅ Automatizado · ⏳ manual |

## 4.3 Seguridad

> Grado en que el producto protege la información y los datos, y se defiende de ataques, de modo que personas y sistemas tengan el acceso adecuado a su tipo y nivel de autorización.

| Subcaracterística | Cómo se atiende en SIGEM | Casos de prueba | Criterio de aceptación | Resultado |
|---|---|---|---|---|
| **Confidencialidad** | Control de acceso basado en roles (RBAC) aplicado al menú, enrutador, buscador global y apertura de órdenes. El técnico no ve rentabilidad, costos, impuestos, usuarios ni configuración, ni órdenes de otros técnicos. | CP-SEG-08 a 13, CP-SEG-22 a 24, CP-SEG-32, CP-SEG-33 | 0 accesos a información no autorizada por rol | ✅ Aprobado |
| **Integridad** | Reglas que impiden estados inconsistentes (finalizar sin panel técnico, pagar más del saldo, marcar pagada con saldo, editar cotización ya ejecutada); escape de HTML contra XSS; operaciones atómicas en inventario. | CP-SEG-14, CP-SEG-25, CP-SEG-34, CP-UNI-17, CP-UNI-18, CP-UNI-28, CP-UNI-54, CP-INT-02 | Ningún dato corrupto ni código inyectado ejecutado | ✅ Aprobado |
| **No repudio** | Cada operación queda registrada con el usuario que la realizó. | CP-SEG-15, CP-SEG-26, CP-SEG-36 | Toda acción crítica tiene autor en bitácora | ✅ Aprobado |
| **Responsabilidad** (*accountability*) | Bitácora de actividad con fecha y hora local, usuario, acción y detalle; visible solo para el administrador. | CP-SEG-15, CP-SEG-26, CP-FUN-25 | Bitácora completa del flujo de 13 pasos | ✅ Aprobado |
| **Autenticidad** | Inicio de sesión con validación de usuario activo; mensaje genérico ante credenciales inválidas; contraseñas ocultas y de mínimo 6 caracteres; correos únicos. | CP-SEG-01 a 07, CP-SEG-16, CP-SEG-17, CP-SEG-19 a 21, CP-SEG-30, CP-SEG-31, CP-SEG-35 | 0 ingresos con credenciales inválidas o usuarios inactivos | ✅ Aprobado |
| **Resistencia** | Un administrador no puede bloquearse a sí mismo; roles inexistentes no tienen acceso. | CP-SEG-12, CP-SEG-18 | El sistema conserva al menos un acceso administrativo | ✅ Aprobado |

### Limitación conocida (declarada)

Al ser un prototipo sin servidor, la seguridad se aplica en el navegador. Un usuario con conocimientos técnicos podría modificar el código desde las herramientas de desarrollador. En una versión de producción estas mismas reglas (`logica.js`) se ejecutarían en la API REST, con contraseñas cifradas (bcrypt) y sesiones con JWT.

---

## 4.4 Resumen

| Característica | Subcaracterísticas evaluadas | Casos automatizados aprobados | Casos manuales para el evaluador |
|---|:---:|:---:|:---:|
| Adecuación funcional | 3 / 3 | 100 % | CP-FUN-01 a 25, CP-ACE-02 |
| Capacidad de interacción (Usabilidad) | 8 / 8 | 100 % | CP-USA-20 a 30 |
| Seguridad | 6 / 6 | 100 % | CP-SEG-30 a 36 |
