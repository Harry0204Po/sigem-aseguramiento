# 3. Casos de prueba — SIGEM

Este documento tiene dos partes:

- **Parte A — Casos manuales** para que el grupo evaluador los ejecute desde la aplicación publicada (caja negra).
- **Parte B — Catálogo de casos automatizados** que el equipo ejecuta con `npm run test:all` y en cada cambio con GitHub Actions.

> **Importante para ejecutar los casos manuales:** los datos viven en memoria. Para que un caso que depende de otro funcione, **no recargue la página** entre ellos; cambie de usuario con *Cerrar sesión*. Si recarga (F5), los datos vuelven a su estado inicial.

Convención de identificadores:

| Prefijo | Tipo de prueba |
|---|---|
| CP-FUN | Funcional (manual) |
| CP-UNI | Funcional a nivel de unidad (automatizada) |
| CP-INT | Integración |
| CP-SIS | Sistema |
| CP-ACE | Aceptación |
| CP-REG | Regresión |
| CP-USA | Usabilidad |
| CP-SEG | Seguridad |

---

## Parte A — Casos manuales

### A.1 Pruebas funcionales

| ID | Módulo / Rol | Precondición | Pasos | Datos de entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|---|---|
| CP-FUN-01 | Login / Administrador | Página de inicio de sesión abierta | 1. Escribir correo y contraseña. 2. Clic en *Ingresar al sistema*. | admin@sigem.com / 123456 | Ingresa al **Dashboard ejecutivo** con 9 indicadores y 4 gráficos; arriba a la derecha aparece "Ana Gutiérrez · Administrador". | Alta |
| CP-FUN-02 | Clientes / Administrador | Sesión de administrador | 1. Menú *Clientes*. 2. *Nuevo cliente*. 3. Llenar el formulario. 4. *Guardar cliente*. | Nombre: Hotel Pacífico, S.A.; NIT: 1234567-8; Tel: 2345-6789; Correo: mantenimiento@hotelpacifico.gt | Mensaje "Cliente **CLI-011** registrado correctamente" y el cliente aparece en la tabla con estado Activo. | Alta |
| CP-FUN-03 | Clientes / Administrador | CP-FUN-01 | Registrar un cliente con un NIT ya existente. | NIT: 5512345-6 | Mensaje "Ya existe un cliente registrado con ese NIT." El formulario no se cierra. | Media |
| CP-FUN-04 | Clientes / Administrador | CP-FUN-01 | 1. En *Residenciales del Valle, S.A.* clic en 👁. 2. Revisar las pestañas. | — | Pestañas *Información*, *Equipos (2)* e *Historial de servicios (2)* con datos del cliente. | Media |
| CP-FUN-05 | Equipos / Administrador | CP-FUN-02 | 1. *Equipos* → *Nuevo equipo*. 2. Seleccionar el cliente creado. 3. *Guardar equipo*. | Bomba centrífuga, Grundfos CR10, 10 HP, 220V, serie GF-0001 | Mensaje "Equipo **EQ-016** registrado correctamente"; aparece filtrando por ese cliente. | Alta |
| CP-FUN-06 | Equipos / Administrador | CP-FUN-01 | Ver (👁) el equipo **EQ-001**. | — | Ficha técnica completa e **historial de mantenimiento** con 2 registros (preventivo y correctivo). | Media |
| CP-FUN-07 | Cotizaciones / Administrador | CP-FUN-05 | 1. *Nueva cotización* para el cliente y equipo creados. 2. Agregar 3 líneas. 3. Observar los totales sin guardar. | Mano de obra 1 × Q1,000; Repuestos 1 × Q1,500; Transporte 1 × Q300; Descuento 0 %; IVA 12 % | Subtotal **Q 2,800.00**, Impuesto **Q 336.00**, Total **Q 3,136.00**. | Alta |
| CP-FUN-08 | Cotizaciones / Administrador | CP-FUN-07 | Cambiar el descuento a 10 %. | Descuento 10 % | Descuento **Q 280.00**, Impuesto **Q 302.40**, Total **Q 2,822.40**. Regresar a 0 % y guardar → "Cotización COT-2026-011 creada en estado Borrador". | Alta |
| CP-FUN-09 | Cotizaciones / Administrador | CP-FUN-08 | 1. Ver COT-2026-011. 2. Cambiar estado a *Aprobada* → *Actualizar estado*. 3. Clic en *Generar orden de trabajo*. | — | El botón *Generar orden de trabajo* aparece solo al estar Aprobada. Se crea **OT-2026-014** en estado Pendiente vinculada a la cotización. | Alta |
| CP-FUN-10 | Cotizaciones / Administrador | CP-FUN-01 | Ver **COT-2026-003** (estado Enviada). | — | No aparece el botón *Generar orden de trabajo*. | Media |
| CP-FUN-11 | Órdenes / Administrador | CP-FUN-01 | 1. *Órdenes de trabajo* → *Nueva orden*. 2. Técnico Carlos Méndez, fecha de **hoy**, hora **11:00**. 3. *Guardar orden*. | Descripción: "Prueba de conflicto" | Recuadro rojo "Conflicto de agenda detectado… OT-2026-013" y el sistema **no guarda** la orden. Al cambiar la hora a 16:00 aparece "Sin conflictos" y sí guarda. | Alta |
| CP-FUN-12 | Órdenes / Administrador | CP-FUN-01 | Pestaña *Agenda de técnicos*. | — | Tabla de 7 días por técnico; hoy Carlos Méndez tiene "11:00 · #013". Clic en la etiqueta abre la orden. | Media |
| CP-FUN-13 | Panel técnico / Técnico | Sesión cerrada del administrador (sin recargar) | 1. Ingresar como técnico. 2. En *Hoy*, *Ejecutar* OT-2026-013. 3. Llenar diagnóstico y trabajo. 4. *Agregar repuesto*: Rodamiento 6205-2RS, cantidad 2. 5. Agregar foto y firmas. 6. *Finalizar servicio*. | tecnico@sigem.com / 123456 | Mensaje "Servicio finalizado… inventario descontado"; se abre el **reporte técnico** con cliente, equipo, diagnóstico, repuestos, mediciones, recomendaciones, fotos y firmas. | Alta |
| CP-FUN-14 | Panel técnico / Técnico | CP-FUN-13 (otra orden) | Intentar *Finalizar servicio* con *Trabajo realizado* vacío. | — | Mensaje "Describa el trabajo realizado antes de finalizar el servicio." La orden sigue abierta. | Media |
| CP-FUN-15 | Panel técnico / Técnico | Sesión de técnico | En una orden abierta agregar *Variador de frecuencia 15HP* con cantidad 2 y finalizar. | Existencia disponible: 1 | La línea muestra "Insuficiente" y el sistema no finaliza: "existencia insuficiente para uno o más repuestos". | Alta |
| CP-FUN-16 | Reporte técnico | CP-FUN-13 | Clic en *Imprimir / Descargar PDF*. | — | Se abre el diálogo de impresión del navegador con el reporte (sin menú lateral); permite *Guardar como PDF*. | Media |
| CP-FUN-17 | Inventario / Administrador | CP-FUN-13 (sin recargar) | 1. Volver como administrador. 2. *Inventario*. 3. Filtrar *Stock bajo*. | — | Rodamiento 6205-2RS muestra **40** (antes 42). Hay alerta amarilla de productos bajo el mínimo y las filas en rojo; el menú muestra la cantidad en un indicador rojo. | Alta |
| CP-FUN-18 | Facturación / Administrador | CP-FUN-17 | *Facturación* → *Generar factura de OT-2026-013*. | Orden sin cotización: tarifa estándar | Factura **FAC-2026-107**: Subtotal Q 1,080.00 (Q800 + Q150 + 2 × Q65), IVA Q 129.60, Total **Q 1,209.60**, estado Pendiente. | Alta |
| CP-FUN-19 | Pagos / Administrativo | CP-FUN-01 (cualquier rol con acceso) | *Pagos y CxC* → *Registrar pago* en **FAC-2026-105** → *Pago parcial*. | Monto Q300, Efectivo | Mensaje "Pago … registrado"; la factura pasa a **Parcial** con saldo **Q 500.00**; el total por cobrar baja Q300. | Alta |
| CP-FUN-20 | Pagos | CP-FUN-19 | Registrar en FAC-2026-105 un pago mayor al saldo. | Monto Q900 | Mensaje "El monto excede el saldo pendiente de Q 500.00". No se registra. | Alta |
| CP-FUN-21 | Gastos / Administrador | CP-FUN-01 | *Gastos* → *Nuevo gasto*. | Combustible, "Diésel unidad 3", Q250, IVA 12 % | Aparece **GAS-013** con total Q 280.00. | Media |
| CP-FUN-22 | Rentabilidad / Administrador | CP-FUN-01 | Abrir *Rentabilidad*. | — | Indicadores de ingresos (sin IVA), costos, utilidad y margen; gráficos mensual y por cliente; tabla por servicio con mano de obra, repuestos, transporte, otros, costo total, utilidad y margen. | Alta |
| CP-FUN-23 | Reportes / Administrador | CP-FUN-01 | *Reportes gerenciales* → *Ver* y *CSV* en "Servicios por técnico". | — | Se muestran los 10 reportes; el CSV se descarga como `SIGEM_Servicios_por_tecnico.csv` y abre en Excel con tildes correctas. | Media |
| CP-FUN-24 | Usuarios / Administrador | CP-FUN-01 | *Usuarios y seguridad* → *Nuevo usuario* con contraseña de 3 caracteres; luego con 6. | Rol Técnico | Primero: "La contraseña debe tener al menos 6 caracteres." Luego se crea el usuario y puede iniciar sesión viendo *Mi panel técnico*. | Media |
| CP-FUN-25 | Bitácora / Administrador | Varios casos anteriores | *Usuarios y seguridad* → *Bitácora de actividad*. | — | Cada acción realizada aparece con fecha y hora local, usuario, acción y detalle. | Media |

### A.2 Prueba de aceptación (flujo de negocio)

| ID | Criterio de aceptación | Pasos | Resultado esperado |
|---|---|---|---|
| CP-ACE-02 | El usuario puede demostrar el proceso completo del negocio sin ayuda externa, usando la *Guía de la demo*. | Recargar la página (F5) para partir de los datos iniciales. Ejecutar en orden CP-FUN-02 → 05 → 07 → 08 → 09 → (editar OT-2026-014: Carlos Méndez, hoy 15:00, Programada) → ingresar como técnico y finalizar OT-2026-014 con 1 *Sello mecánico 5/8"* → como administrador generar factura de OT-2026-014 → pagar Q1,136 y luego el saldo → *Rentabilidad*. | Factura FAC-2026-107 por **Q 3,136.00**; tras el segundo pago queda **Pagada**; en Rentabilidad la fila OT-2026-014 muestra ingreso sin IVA **Q 2,800.00**, costo total **Q 855.00**, utilidad **Q 1,945.00** y margen **69.5 %**. |

### A.3 Pruebas de seguridad (manuales)

| ID | Escenario | Pasos | Resultado esperado |
|---|---|---|---|
| CP-SEG-30 | Contraseña incorrecta | Ingresar admin@sigem.com con 000000. | "Correo o contraseña incorrectos." (no indica cuál de los dos falló). |
| CP-SEG-31 | Usuario inactivo | Ingresar fruiz@sigem.com / 123456. | Acceso denegado: usuario inactivo. |
| CP-SEG-32 | Confidencialidad del Técnico | Ingresar como técnico y revisar menú, dashboard y buscador superior (buscar "Industrias" y "FAC"). | Solo ve Dashboard, Mi panel técnico y Guía. Su dashboard no muestra montos. El buscador no devuelve clientes ni facturas. |
| CP-SEG-33 | Restricciones del Administrativo | Ingresar como administrativo@sigem.com. | No ve Inventario, Gastos, Rentabilidad, Reportes ni Usuarios. |
| CP-SEG-34 | Inyección de código (XSS) | Registrar un cliente con nombre `<b>Prueba</b><img src=x onerror=alert(1)>`. | El texto se muestra tal cual en la tabla; no aparece ninguna alerta ni el texto en negrita. |
| CP-SEG-35 | Protección de la contraseña | Revisar el campo de contraseña en el login y en *Editar usuario*. | Se muestra con puntos (tipo contraseña). |
| CP-SEG-36 | Trazabilidad | Iniciar y cerrar sesión, luego revisar la bitácora como administrador. | Se registran "Inicio de sesión" y "Cierre de sesión" con usuario y hora. |

### A.4 Pruebas de usabilidad (lista de verificación heurística)

Basada en las 10 heurísticas de Nielsen. Calificar cada punto de 1 (muy malo) a 5 (excelente) y anotar observaciones.

| ID | Heurística | Qué observar en SIGEM |
|---|---|---|
| CP-USA-20 | Visibilidad del estado del sistema | ¿Cada acción muestra una notificación? ¿Los estados (Pendiente, Aprobada, Pagada…) se distinguen por color? ¿El menú resalta el módulo actual? |
| CP-USA-21 | Relación con el mundo real | ¿Los términos (orden de trabajo, existencia, NIT, cuentas por cobrar, HP, variador) son los que usaría la empresa? ¿Montos en quetzales? |
| CP-USA-22 | Control y libertad del usuario | ¿Se puede cancelar o cerrar cualquier formulario? ¿Se puede volver atrás sin perder datos guardados? |
| CP-USA-23 | Consistencia y estándares | ¿Botones, tablas, filtros y formularios se comportan igual en todos los módulos? |
| CP-USA-24 | Prevención de errores | ¿Se impiden pagos mayores al saldo, horarios en conflicto, repuestos sin existencia, NIT duplicados? |
| CP-USA-25 | Reconocer antes que recordar | ¿Las listas desplegables evitan escribir códigos? ¿El equipo se filtra según el cliente elegido? |
| CP-USA-26 | Flexibilidad y eficiencia | ¿El buscador global, los filtros y los accesos rápidos del login agilizan el trabajo? |
| CP-USA-27 | Diseño estético y minimalista | ¿Las pantallas muestran solo lo necesario? ¿La jerarquía visual es clara? |
| CP-USA-28 | Ayuda a reconocer y corregir errores | ¿Los mensajes de error dicen qué pasó y cómo corregirlo? |
| CP-USA-29 | Ayuda y documentación | ¿La *Guía de la demo* explica el flujo y permite ir a cada paso? |
| CP-USA-30 | Diseño responsive | Abrir el enlace en un teléfono: ¿login, menú hamburguesa, tablas y formularios se pueden usar sin zoom? |

---

## Parte B — Catálogo de casos automatizados

Resultado de la última ejecución en [06-informe-de-ejecucion.md](06-informe-de-ejecucion.md). Cuando un mismo caso se ejecuta con varios datos de entrada (partición de equivalencia), la columna *Ejecuciones* indica cuántas variantes se probaron.

### B.1 Funcionales a nivel de unidad (Jest)

| ID | Caso | Archivo | Ejecuciones | Resultado |
|---|---|---|:---:|:---:|
| CP-UNI-01 | Ejemplo del requerimiento: MO Q1,000 + Repuestos Q1,500 + Transporte Q300 con IVA 12% | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-02 | Aplica el descuento antes del impuesto | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-03 | Multiplica cantidad por precio unitario en cada línea | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-04 | Sin líneas el total es 0 (valor límite) | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-05 | Redondea a 2 decimales | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-06 | Descuento del 100% deja el total en 0 (valor límite) | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-07 | Crea una cotización válida en estado Borrador con correlativo | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-08 | Rechaza una cotización sin líneas de detalle | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-09 | Rechaza cantidades en 0 o negativas | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-10 | Rechaza precio unitario negativo | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-11 | Rechaza descuento fuera de 0–100% | `tests/unit/cotizaciones.test.js` | 2 | ✅ Aprobado |
| CP-UNI-12 | Rechaza un equipo que no pertenece al cliente | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-13 | Rechaza cliente sin equipos registrados | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-14 | Calcula la fecha de vencimiento según la vigencia | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-15 | Cambia de Enviada a Aprobada y registra en bitácora | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-16 | Rechaza un estado que no existe | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-17 | No permite rechazar una cotización que ya generó orden de trabajo | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-18 | No permite editar una cotización que ya generó orden de trabajo | `tests/unit/cotizaciones.test.js` | 1 | ✅ Aprobado |
| CP-UNI-19 | Detecta choque: mismo técnico, misma fecha y hora | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-20 | Sin choque si cambia la hora | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-21 | Sin choque si es otro técnico en el mismo horario | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-22 | Ignora órdenes canceladas | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-23 | Al editar, la orden no choca consigo misma | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-24 | Crea una orden válida con ejecución vacía | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-25 | Bloquea el guardado cuando hay conflicto de horario | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-26 | Exige descripción del problema | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-27 | Rechaza hora inválida | `tests/unit/ordenes.test.js` | 3 | ✅ Aprobado |
| CP-UNI-28 | No permite marcar una orden como Finalizada desde el formulario | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-29 | Rechaza un equipo de otro cliente | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-30 | Solo genera la orden si la cotización está Aprobada | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-31 | Genera la orden con los datos de la cotización aprobada | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-32 | No genera una segunda orden para la misma cotización | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-33 | La orden generada se programa en un horario libre del técnico | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-34 | Descuenta automáticamente el inventario utilizado | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-35 | No finaliza si la existencia es insuficiente y no modifica el inventario | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-36 | Suma líneas repetidas del mismo repuesto antes de validar existencia | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-37 | Exige describir el trabajo realizado | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-38 | Rechaza hora de fin anterior a la de inicio | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-39 | No permite finalizar dos veces la misma orden | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-40 | No permite finalizar una orden cancelada | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-41 | Actualiza el último mantenimiento e historial del equipo | `tests/unit/ordenes.test.js` | 1 | ✅ Aprobado |
| CP-UNI-42 | Calcula el saldo restando los pagos aplicados | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-43 | Una factura anulada no genera saldo por cobrar | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-44 | Una factura pagada tiene saldo 0 | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-45 | Solo se factura una orden Finalizada | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-46 | La factura toma subtotal, IVA y total de la cotización origen | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-47 | No permite facturar dos veces la misma orden | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-48 | Pago parcial deja la factura en estado Parcial con saldo correcto | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-49 | Pago por el saldo exacto deja la factura Pagada (valor límite) | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-50 | Rechaza un pago mayor al saldo pendiente | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-51 | Rechaza montos no válidos | `tests/unit/facturacion.test.js` | 3 | ✅ Aprobado |
| CP-UNI-52 | No registra pagos en facturas anuladas ni en facturas ya pagadas | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-53 | Rechaza un método de pago no permitido | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-54 | No permite marcar como Pagada una factura con saldo pendiente | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-55 | Permite anular una factura y una anulada ya no cambia de estado | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-56 | Una factura Vencida conserva su saldo por cobrar | `tests/unit/facturacion.test.js` | 1 | ✅ Aprobado |
| CP-UNI-57 | Registra un cliente válido con código correlativo | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-58 | Nombre y NIT son obligatorios | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-59 | No permite NIT duplicado | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-60 | Rechaza correo con formato inválido | `tests/unit/catalogos.test.js` | 3 | ✅ Aprobado |
| CP-UNI-61 | Rechaza teléfono que no tiene 8 dígitos | `tests/unit/catalogos.test.js` | 3 | ✅ Aprobado |
| CP-UNI-62 | Edita un cliente conservando su propio NIT | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-63 | Si no se indica empresa, usa el nombre | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-64 | Registra un equipo asociado a un cliente | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-65 | Marca y número de serie son obligatorios | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-66 | No permite números de serie duplicados | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-67 | Rechaza potencia HP no positiva | `tests/unit/catalogos.test.js` | 2 | ✅ Aprobado |
| CP-UNI-68 | Permite paneles de control sin potencia HP | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-69 | Identifica stock bajo cuando la existencia es menor o igual al mínimo (valor límite) | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-70 | Los datos de demostración tienen productos con stock bajo para la alerta visual | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-71 | No permite valores negativos ni precio de venta menor al costo | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-72 | Calcula el total del gasto con impuesto | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-73 | Registra un gasto válido y rechaza montos no positivos o categorías inválidas | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-74 | Ejemplo del requerimiento: ingreso Q5,000 y costos Q2,500 → utilidad Q2,500 y margen 50% | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-75 | Detecta servicios con pérdida (utilidad y margen negativos) | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-76 | Sin ingreso el margen es 0 (evita división entre cero) | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-77 | Los repuestos se valoran a costo de inventario en la rentabilidad de la orden | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-78 | Suma días cruzando cambio de mes y de año | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-79 | Valida formato de fecha y hora | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-80 | Rango de últimos 30 días incluye los extremos (valores límite) | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-81 | Genera las etiquetas de los últimos 6 meses | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-82 | Cumplen las cantidades mínimas requeridas | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-83 | Incluyen los clientes y técnicos indicados en el requerimiento | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-84 | Integridad referencial: toda orden, equipo y factura apunta a registros existentes | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-85 | Cada llamada crea una base independiente (las pruebas no comparten estado) | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-86 | Desplaza las fechas para que la fecha de referencia coincida con | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-87 | Las líneas tipo "Materiales" de cotizaciones nuevas se incluyen en los costos | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-88 | Usa tarifa estándar (MO Q800 + visita Q150) más repuestos a precio de venta, con IVA 12% | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-89 | Un usuario Técnico nuevo queda vinculado a un técnico de campo | `tests/unit/catalogos.test.js` | 1 | ✅ Aprobado |
| CP-UNI-90 | Después de las 18:00 "hoy" sigue siendo el día local, no el día UTC | `tests/unit/utilidades-datos.test.js` | 1 | ✅ Aprobado |

### B.2 Integración (Jest)

| ID | Caso | Archivo | Ejecuciones | Resultado |
|---|---|---|:---:|:---:|
| CP-INT-01 | Flujo de 13 pasos: cliente → cotización → orden → servicio → factura → pago → rentabilidad | `tests/integration/flujo-negocio.test.js` | 12 | ✅ Aprobado |
| CP-INT-02 | Inventario ↔ órdenes ↔ alertas | `tests/integration/flujo-negocio.test.js` | 2 | ✅ Aprobado |
| CP-INT-03 | Facturación ↔ pagos ↔ cuentas por cobrar | `tests/integration/flujo-negocio.test.js` | 2 | ✅ Aprobado |
| CP-INT-04 | Cotización ↔ agenda de técnicos | `tests/integration/flujo-negocio.test.js` | 1 | ✅ Aprobado |

### B.3 Sistema (Playwright)

| ID | Caso | Archivo | Ejecuciones | Resultado |
|---|---|---|:---:|:---:|
| CP-SIS-01 | El dashboard muestra los 9 indicadores y los 4 gráficos | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-02 | Buscador y filtro de clientes | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-03 | El formulario de cliente valida campos obligatorios y formato de correo | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-04 | El sistema bloquea asignar un técnico en un horario ocupado | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-05 | "Generar orden de trabajo" solo aparece en cotizaciones aprobadas sin orden | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-06 | El inventario muestra alertas visuales de stock bajo | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-07 | Rechaza un pago mayor al saldo de la factura | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-08 | Exporta un reporte gerencial a CSV | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-09 | La búsqueda global encuentra y abre una orden | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-10 | La agenda de técnicos muestra las órdenes programadas para hoy | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |
| CP-SIS-11 | El reporte técnico de una orden finalizada se puede imprimir/descargar | `tests/e2e/sistema.spec.js` | 1 | ✅ Aprobado |

### B.4 Aceptación (Playwright)

| ID | Caso | Archivo | Ejecuciones | Resultado |
|---|---|---|:---:|:---:|
| CP-ACE-01 | Flujo completo del negocio desde la interfaz (13 pasos) | `tests/e2e/aceptacion-flujo.spec.js` | 1 | ✅ Aprobado |

### B.5 Regresión (Playwright + toda la suite en CI)

| ID | Caso | Archivo | Ejecuciones | Resultado |
|---|---|---|:---:|:---:|
| CP-REG-01 | Todos los módulos cargan sin errores (los 3 roles) | `tests/e2e/regresion.spec.js` | 3 | ✅ Aprobado |
| CP-REG-02 | [Defecto corregido] Las fechas de la demo son relativas a hoy: el técnico tiene órdenes del día | `tests/e2e/regresion.spec.js` | 1 | ✅ Aprobado |
| CP-REG-03 | [Defecto corregido] Los indicadores de ingresos y gastos no aparecen en cero | `tests/e2e/regresion.spec.js` | 1 | ✅ Aprobado |
| CP-REG-04 | [Defecto corregido] "Mi perfil" funciona para roles sin acceso a Usuarios | `tests/e2e/regresion.spec.js` | 1 | ✅ Aprobado |
| CP-REG-05 | [Defecto corregido] Una orden no puede marcarse "Finalizada" desde el formulario de edición | `tests/e2e/regresion.spec.js` | 1 | ✅ Aprobado |
| CP-REG-06 | Los datos registrados se reinician al recargar (comportamiento esperado del prototipo) | `tests/e2e/regresion.spec.js` | 1 | ✅ Aprobado |
| CP-REG-07 | [Defecto corregido] Un usuario Técnico creado por el administrador puede usar su panel | `tests/e2e/regresion.spec.js` | 1 | ✅ Aprobado |

### B.6 Usabilidad (Playwright, escritorio y móvil)

| ID | Caso | Archivo | Ejecuciones | Resultado |
|---|---|---|:---:|:---:|
| CP-USA-01 | La pantalla de inicio de sesión se adapta al ancho del teléfono | `tests/e2e/usabilidad-movil.spec.js` | 1 | ✅ Aprobado |
| CP-USA-02 | El menú lateral se oculta y se abre con el botón hamburguesa | `tests/e2e/usabilidad-movil.spec.js` | 1 | ✅ Aprobado |
| CP-USA-03 | Las tablas se desplazan dentro de su contenedor sin romper la página | `tests/e2e/usabilidad-movil.spec.js` | 1 | ✅ Aprobado |
| CP-USA-04 | Los formularios en modal permiten llegar al botón Guardar | `tests/e2e/usabilidad-movil.spec.js` | 1 | ✅ Aprobado |
| CP-USA-05 | El técnico puede ejecutar su orden desde el teléfono | `tests/e2e/usabilidad-movil.spec.js` | 1 | ✅ Aprobado |
| CP-USA-10 | Se puede iniciar sesión solo con el teclado (Enter) | `tests/e2e/usabilidad.spec.js` | 1 | ✅ Aprobado |
| CP-USA-11 | Cada acción importante muestra una notificación de confirmación | `tests/e2e/usabilidad.spec.js` | 1 | ✅ Aprobado |
| CP-USA-12 | El menú resalta el módulo activo y cada vista tiene título y descripción | `tests/e2e/usabilidad.spec.js` | 1 | ✅ Aprobado |
| CP-USA-13 | Los estados se muestran con etiquetas de color consistentes | `tests/e2e/usabilidad.spec.js` | 1 | ✅ Aprobado |
| CP-USA-14 | La guía de la demo explica el flujo de 13 pasos y permite ir a cada módulo | `tests/e2e/usabilidad.spec.js` | 1 | ✅ Aprobado |
| CP-USA-15 | El nombre SIGEM y su subtítulo están siempre visibles | `tests/e2e/usabilidad.spec.js` | 1 | ✅ Aprobado |

### B.7 Seguridad (Jest y Playwright)

| ID | Caso | Archivo | Ejecuciones | Resultado |
|---|---|---|:---:|:---:|
| CP-SEG-01 | Inicia sesión con credenciales válidas de demo | `tests/unit/seguridad.test.js` | 3 | ✅ Aprobado |
| CP-SEG-02 | El correo no distingue mayúsculas ni espacios | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-03 | Rechaza contraseña incorrecta con mensaje genérico | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-04 | Un correo inexistente recibe el mismo mensaje (no revela usuarios) | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-05 | Bloquea el acceso de usuarios inactivos | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-06 | Rechaza campos vacíos | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-07 | La contraseña distingue mayúsculas y minúsculas | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-08 | El Técnico NO puede acceder a | `tests/unit/seguridad.test.js` | 10 | ✅ Aprobado |
| CP-SEG-09 | El Técnico solo ve Dashboard, Mi panel técnico y Guía | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-10 | El Administrativo accede a clientes, cotizaciones, facturación y pagos, pero no a rentabilidad ni usuarios | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-11 | El Administrador accede a todos los módulos administrativos | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-12 | Un rol o vista inexistente no tiene acceso | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-13 | Cada rol inicia en su vista correspondiente | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-14 | Escapa HTML para prevenir inyección de scripts (XSS) | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-15 | Las operaciones registran usuario, acción y fecha en la bitácora | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-16 | Exige contraseña de al menos 6 caracteres al crear usuarios | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-17 | No permite correos de usuario duplicados | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-18 | El administrador no puede desactivarse ni quitarse el rol a sí mismo | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-19 | Rechaza roles que no existen al crear usuarios | `tests/unit/seguridad.test.js` | 1 | ✅ Aprobado |
| CP-SEG-20 | Credenciales incorrectas no permiten el ingreso | `tests/e2e/seguridad.spec.js` | 1 | ✅ Aprobado |
| CP-SEG-21 | Un usuario inactivo no puede iniciar sesión | `tests/e2e/seguridad.spec.js` | 1 | ✅ Aprobado |
| CP-SEG-22 | El Técnico solo ve sus módulos y no puede abrir Rentabilidad | `tests/e2e/seguridad.spec.js` | 1 | ✅ Aprobado |
| CP-SEG-23 | El Técnico no puede ver órdenes de otros técnicos ni datos de clientes | `tests/e2e/seguridad.spec.js` | 1 | ✅ Aprobado |
| CP-SEG-24 | El rol Administrativo no ve rentabilidad, gastos, reportes, inventario ni usuarios | `tests/e2e/seguridad.spec.js` | 1 | ✅ Aprobado |
| CP-SEG-25 | Los datos ingresados se muestran como texto (protección contra XSS) | `tests/e2e/seguridad.spec.js` | 1 | ✅ Aprobado |
| CP-SEG-26 | Cerrar sesión regresa al login, limpia credenciales y registra la acción en bitácora | `tests/e2e/seguridad.spec.js` | 1 | ✅ Aprobado |
