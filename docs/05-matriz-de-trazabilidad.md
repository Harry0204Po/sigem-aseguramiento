# 5. Matriz de trazabilidad — Requerimientos ↔ Casos de prueba

Relaciona cada requerimiento del documento de especificación de SIGEM con los casos que lo verifican. Un requerimiento se considera **cubierto** cuando tiene al menos un caso automatizado aprobado o un caso manual definido.

## 5.1 Requerimientos funcionales

| ID | Requerimiento (sección de la especificación) | Módulo | Casos automatizados | Casos manuales | Estado |
|---|---|---|---|---|---|
| RF-01 | Inicio de sesión simulado con credenciales de demo (§2) | Login | CP-SEG-01 a 07, CP-SEG-20, CP-SEG-21, CP-USA-10 | CP-FUN-01, CP-SEG-30, CP-SEG-31 | ✅ Cubierto |
| RF-02 | Roles Administrador, Técnico y Administrativo con accesos diferenciados (§2, §16) | Seguridad | CP-SEG-08 a 13, CP-SEG-22 a 24, CP-REG-01 | CP-SEG-32, CP-SEG-33 | ✅ Cubierto |
| RF-03 | Dashboard con 9 indicadores y 4 gráficos (§3) | Dashboard | CP-SIS-01, CP-REG-03 | CP-FUN-01 | ✅ Cubierto |
| RF-04 | Clientes: crear, editar, consultar, historial y equipos asociados (§4) | Clientes | CP-UNI-57 a 63, CP-SIS-02, CP-SIS-03, CP-INT-01 | CP-FUN-02 a 04 | ✅ Cubierto |
| RF-05 | Equipos por cliente, 5 tipos, datos técnicos e historial de mantenimiento (§5) | Equipos | CP-UNI-41, CP-UNI-64 a 68 | CP-FUN-05, CP-FUN-06 | ✅ Cubierto |
| RF-06 | Cotizaciones con detalle, descuento, impuestos y total (§6) | Cotizaciones | CP-UNI-01 a 14, CP-ACE-01 | CP-FUN-07, CP-FUN-08 | ✅ Cubierto |
| RF-07 | Estados de cotización y botón "Generar orden de trabajo" al aprobar (§6) | Cotizaciones | CP-UNI-15 a 18, CP-UNI-30 a 32, CP-SIS-05 | CP-FUN-09, CP-FUN-10 | ✅ Cubierto |
| RF-08 | Órdenes de trabajo con estados, prioridad y agenda de técnicos (§7) | Órdenes | CP-UNI-24, CP-UNI-26 a 29, CP-SIS-10, CP-REG-05 | CP-FUN-12 | ✅ Cubierto |
| RF-09 | Validación para no asignar un técnico a dos trabajos en el mismo horario (§7) | Órdenes | CP-UNI-19 a 23, CP-UNI-25, CP-UNI-33, CP-SIS-04, CP-INT-04 | CP-FUN-11 | ✅ Cubierto |
| RF-10 | Panel del técnico: hoy, próximos, pendientes, historial y registro de ejecución (§8) | Panel técnico | CP-UNI-34 a 40, CP-REG-02, CP-USA-05, CP-ACE-01 | CP-FUN-13, CP-FUN-14 | ✅ Cubierto |
| RF-11 | Reporte técnico con firmas y opción de descargar PDF (§9) | Reporte técnico | CP-SIS-11, CP-INT-01 (paso 10) | CP-FUN-16 | ✅ Cubierto |
| RF-12 | Inventario con alertas visuales de stock bajo (§10) | Inventario | CP-UNI-69 a 71, CP-SIS-06, CP-INT-02 | CP-FUN-17 | ✅ Cubierto |
| RF-13 | Descuento automático del inventario al usar repuestos (§10) | Inventario | CP-UNI-34 a 36, CP-INT-01, CP-INT-02 | CP-FUN-15, CP-FUN-17 | ✅ Cubierto |
| RF-14 | Facturación simulada desde orden finalizada, con estados (§11) | Facturación | CP-UNI-45 a 47, CP-UNI-54 a 56, CP-UNI-88, CP-INT-03 | CP-FUN-18 | ✅ Cubierto |
| RF-15 | Pagos totales y parciales; total por cobrar, vencidas y por vencer (§12) | Pagos y CxC | CP-UNI-42 a 44, CP-UNI-48 a 53, CP-SIS-07, CP-INT-03 | CP-FUN-19, CP-FUN-20 | ✅ Cubierto |
| RF-16 | Registro de gastos por categoría con impuesto y total (§13) | Gastos | CP-UNI-72, CP-UNI-73, CP-USA-11 | CP-FUN-21 | ✅ Cubierto |
| RF-17 | Rentabilidad por servicio, cliente y mes; servicios con pérdida (§14) | Rentabilidad | CP-UNI-74 a 77, CP-UNI-87, CP-INT-01 (paso 13) | CP-FUN-22 | ✅ Cubierto |
| RF-18 | 10 reportes gerenciales (§15) | Reportes | CP-SIS-08 | CP-FUN-23 | ✅ Cubierto |
| RF-19 | Pantalla de usuarios y roles; bitácora (§16) | Usuarios | CP-SEG-15 a 19, CP-SEG-26, CP-REG-07, CP-UNI-89 | CP-FUN-24, CP-FUN-25 | ✅ Cubierto |
| RF-20 | Flujo completo de 13 pasos demostrable (§19) | Todos | CP-ACE-01, CP-INT-01 | CP-ACE-02 | ✅ Cubierto |
| RF-21 | Datos de demostración con cantidades mínimas (§20) | Datos | CP-UNI-82 a 86 | — | ✅ Cubierto |

## 5.2 Requerimientos no funcionales

| ID | Requerimiento | Casos | Estado |
|---|---|---|---|
| RNF-01 | Interfaz en español, apariencia empresarial y nombre SIGEM siempre visible (§1, §22) | CP-USA-15, CP-USA-21, CP-USA-27 | ✅ Cubierto |
| RNF-02 | Diseño responsive (§1) | CP-USA-01 a 05, CP-USA-30 | ✅ Cubierto |
| RNF-03 | Usabilidad: navegación clara y procesos fáciles de comprender (§17) | CP-USA-10 a 14, CP-USA-20 a 29 | ✅ Cubierto |
| RNF-04 | Seguridad: roles, permisos, autenticación y protección de información sensible (§17) | CP-SEG-01 a 36 | ✅ Cubierto |
| RNF-05 | Diseño orientado a pruebas de caja negra (§18) | Toda la suite (docs 02 y 03) | ✅ Cubierto |
| RNF-06 | Arquitectura preparada para API REST, base de datos relacional y facturación electrónica (§21) | Separación `logica.js` / `app.js`; documento 01, sección 1.4 | ✅ Cubierto |

## 5.3 Resumen de cobertura

| Tipo | Requerimientos | Cubiertos | Cobertura |
|---|:---:|:---:|:---:|
| Funcionales | 21 | 21 | 100 % |
| No funcionales | 6 | 6 | 100 % |
