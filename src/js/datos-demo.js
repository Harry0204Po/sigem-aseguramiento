/* =========================================================================
   SIGEM — Datos de demostración (mock data)
   Genera una base de datos simulada en memoria. Cada llamada devuelve una
   copia nueva e independiente, lo que permite reiniciar el estado en pruebas.
   Las fechas se diseñaron con referencia al 19/09/2026 y se desplazan para
   que esa fecha coincida con el día indicado en `hoy`.
   ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./logica.js'));
  else root.SIGEM_DATOS = factory(root.SIGEM_LOGICA);
})(typeof self !== 'undefined' ? self : this, function (L) {
  'use strict';

  const FECHA_REFERENCIA = '2026-09-19';

  /**
   * Crea la base de datos de demostración.
   * @param {string} [hoy] Fecha YYYY-MM-DD que se tomará como "hoy". Por defecto, la fecha actual.
   * @returns {object} Objeto con las colecciones del sistema.
   */
  function crearDatosDemo(hoy) {
    hoy = hoy || L.todayStr();
    const REF = FECHA_REFERENCIA;
    const db = { clientes:[], equipos:[], tecnicos:[], usuarios:[], mantenimientos:[], cotizaciones:[], ordenes:[], productos:[], facturas:[], pagos:[], gastos:[], bitacora:[], notificaciones:[] };

    /* --- Usuarios / Técnicos --- */
    db.tecnicos = [
      {id:'TEC-01', nombre:'Carlos Méndez', especialidad:'Bombas y motores', telefono:'5511-2201', estado:'Disponible', foto:'CM'},
      {id:'TEC-02', nombre:'José Ramírez', especialidad:'Paneles de control', telefono:'5511-2202', estado:'Disponible', foto:'JR'},
      {id:'TEC-03', nombre:'Luis Herrera', especialidad:'Variadores de frecuencia', telefono:'5511-2203', estado:'Ocupado', foto:'LH'},
      {id:'TEC-04', nombre:'Pedro Morales', especialidad:'Mantenimiento general', telefono:'5511-2204', estado:'Disponible', foto:'PM'},
    ];

    db.usuarios = [
      {id:'USR-01', nombre:'Ana Gutiérrez', email:'admin@sigem.com', pass:'123456', rol:'Administrador', estado:'Activo', ultimoAcceso:REF, tecnicoId:null},
      {id:'USR-02', nombre:'María López', email:'administrativo@sigem.com', pass:'123456', rol:'Administrativo', estado:'Activo', ultimoAcceso:REF, tecnicoId:null},
      {id:'USR-03', nombre:'Carlos Méndez', email:'tecnico@sigem.com', pass:'123456', rol:'Técnico', estado:'Activo', ultimoAcceso:REF, tecnicoId:'TEC-01'},
      {id:'USR-04', nombre:'José Ramírez', email:'jramirez@sigem.com', pass:'123456', rol:'Técnico', estado:'Activo', ultimoAcceso:'2026-09-15', tecnicoId:'TEC-02'},
      {id:'USR-05', nombre:'Luis Herrera', email:'lherrera@sigem.com', pass:'123456', rol:'Técnico', estado:'Activo', ultimoAcceso:'2026-09-17', tecnicoId:'TEC-03'},
      {id:'USR-06', nombre:'Fernanda Ruiz', email:'fruiz@sigem.com', pass:'123456', rol:'Administrativo', estado:'Inactivo', ultimoAcceso:'2026-07-02', tecnicoId:null},
    ];

    /* --- Clientes (10) --- */
    db.clientes = [
      {id:'CLI-001', nombre:'Residenciales del Valle, S.A.', empresa:'Residenciales del Valle, S.A.', nit:'5512345-6', telefono:'2234-1122', correo:'contacto@resvalle.gt', direccion:'Km 14.5 Carretera a El Salvador, Fraijanes', estado:'Activo'},
      {id:'CLI-002', nombre:'Industrias San José', empresa:'Industrias San José, S.A.', nit:'8823456-1', telefono:'2245-7788', correo:'mantenimiento@indsanjose.com', direccion:'Zona 12, Ciudad de Guatemala', estado:'Activo'},
      {id:'CLI-003', nombre:'Comercializadora Eléctrica del Sur', empresa:'Comercializadora Eléctrica del Sur, S.A.', nit:'7712398-4', telefono:'2298-3345', correo:'compras@electricasur.com', direccion:'Escuintla, Escuintla', estado:'Activo'},
      {id:'CLI-004', nombre:'Condominio Las Fuentes', empresa:'Condominio Las Fuentes', nit:'CF-99001', telefono:'5566-1234', correo:'administracion@lasfuentes.gt', direccion:'Carretera a Muxbal, zona 16', estado:'Activo'},
      {id:'CLI-005', nombre:'Textiles Guatemala, S.A.', empresa:'Textiles Guatemala, S.A.', nit:'4456781-2', telefono:'2311-9090', correo:'operaciones@textilesgt.com', direccion:'Parque Industrial, Mixco', estado:'Activo'},
      {id:'CLI-006', nombre:'Agroindustrial El Progreso', empresa:'Agroindustrial El Progreso, S.A.', nit:'3321987-7', telefono:'7788-4455', correo:'contacto@agroprogreso.com', direccion:'El Progreso, Jutiapa', estado:'Activo'},
      {id:'CLI-007', nombre:'Hospital San Rafael', empresa:'Hospital San Rafael', nit:'HSR-44120', telefono:'2278-6600', correo:'infraestructura@hsanrafael.org', direccion:'Zona 9, Ciudad de Guatemala', estado:'Activo'},
      {id:'CLI-008', nombre:'Municipalidad de Villa Nueva', empresa:'Municipalidad de Villa Nueva', nit:'MVN-00187', telefono:'6630-1100', correo:'infraestructura@muivillanueva.gob.gt', direccion:'Villa Nueva, Guatemala', estado:'Activo'},
      {id:'CLI-009', nombre:'Avícola La Esperanza', empresa:'Avícola La Esperanza, S.A.', nit:'2298761-3', telefono:'5522-8899', correo:'mantenimiento@avilaesperanza.com', direccion:'Chimaltenango', estado:'Inactivo'},
      {id:'CLI-010', nombre:'Centro Comercial Metrocentro', empresa:'Inversiones Metrocentro, S.A.', nit:'6654321-9', telefono:'2233-5500', correo:'operaciones@metrocentro.gt', direccion:'Villa Nueva, zona 4', estado:'Activo'},
    ];

    /* --- Equipos (15) --- */
    db.equipos = [
      {id:'EQ-001', clienteId:'CLI-001', tipo:'Bomba sumergible', marca:'Franklin Electric', modelo:'FPS-30HP', potenciaHP:30, voltaje:'460V', serie:'FE-90123', ubicacion:'Pozo principal', estado:'Activo', ultMant:'2026-08-02'},
      {id:'EQ-002', clienteId:'CLI-001', tipo:'Panel de control', marca:'Schneider Electric', modelo:'PC-Altivar', potenciaHP:null, voltaje:'480V', serie:'SE-44821', ubicacion:'Caseta de bombeo', estado:'Activo', ultMant:'2026-08-02'},
      {id:'EQ-003', clienteId:'CLI-002', tipo:'Motor eléctrico', marca:'WEG', modelo:'W22-20HP', potenciaHP:20, voltaje:'220/440V', serie:'WEG-77102', ubicacion:'Línea de producción 1', estado:'Activo', ultMant:'2026-07-20'},
      {id:'EQ-004', clienteId:'CLI-002', tipo:'Variador de frecuencia', marca:'Danfoss', modelo:'VLT-FC102', potenciaHP:20, voltaje:'440V', serie:'DF-33087', ubicacion:'Línea de producción 1', estado:'En mantenimiento', ultMant:'2026-09-10'},
      {id:'EQ-005', clienteId:'CLI-003', tipo:'Bomba centrífuga', marca:'Grundfos', modelo:'CR15-90HP', potenciaHP:15, voltaje:'220V', serie:'GF-55291', ubicacion:'Área de despacho', estado:'Activo', ultMant:'2026-06-14'},
      {id:'EQ-006', clienteId:'CLI-004', tipo:'Bomba centrífuga', marca:'Pedrollo', modelo:'CP-15HP', potenciaHP:15, voltaje:'220V', serie:'PD-11209', ubicacion:'Cuarto de bombas, sótano 1', estado:'Activo', ultMant:'2026-08-28'},
      {id:'EQ-007', clienteId:'CLI-004', tipo:'Bomba sumergible', marca:'Franklin Electric', modelo:'FPS-10HP', potenciaHP:10, voltaje:'220V', serie:'FE-90987', ubicacion:'Cisterna de reserva', estado:'Fuera de servicio', ultMant:'2026-05-30'},
      {id:'EQ-008', clienteId:'CLI-005', tipo:'Motor eléctrico', marca:'Siemens', modelo:'1LE1-25HP', potenciaHP:25, voltaje:'440V', serie:'SI-20981', ubicacion:'Planta textil, telares', estado:'Activo', ultMant:'2026-09-01'},
      {id:'EQ-009', clienteId:'CLI-005', tipo:'Panel de control', marca:'Allen-Bradley', modelo:'CENTERLINE 2100', potenciaHP:null, voltaje:'480V', serie:'AB-66120', ubicacion:'Sala eléctrica principal', estado:'Activo', ultMant:'2026-09-01'},
      {id:'EQ-010', clienteId:'CLI-006', tipo:'Bomba centrífuga', marca:'Grundfos', modelo:'CR32-40HP', potenciaHP:40, voltaje:'460V', serie:'GF-70044', ubicacion:'Sistema de riego', estado:'Activo', ultMant:'2026-07-11'},
      {id:'EQ-011', clienteId:'CLI-007', tipo:'Motor eléctrico', marca:'WEG', modelo:'W22-15HP', potenciaHP:15, voltaje:'220V', serie:'WEG-81034', ubicacion:'Planta de emergencia', estado:'Activo', ultMant:'2026-08-19'},
      {id:'EQ-012', clienteId:'CLI-007', tipo:'Variador de frecuencia', marca:'ABB', modelo:'ACS580', potenciaHP:15, voltaje:'440V', serie:'ABB-29981', ubicacion:'Cuarto de máquinas', estado:'Activo', ultMant:'2026-08-19'},
      {id:'EQ-013', clienteId:'CLI-008', tipo:'Bomba sumergible', marca:'Pedrollo', modelo:'FPS-20HP', potenciaHP:20, voltaje:'220V', serie:'PD-45521', ubicacion:'Estación de bombeo municipal', estado:'Activo', ultMant:'2026-06-30'},
      {id:'EQ-014', clienteId:'CLI-010', tipo:'Bomba centrífuga', marca:'Grundfos', modelo:'CR8-15HP', potenciaHP:15, voltaje:'220V', serie:'GF-31872', ubicacion:'Sistema contra incendios', estado:'Activo', ultMant:'2026-08-05'},
      {id:'EQ-015', clienteId:'CLI-010', tipo:'Panel de control', marca:'Schneider Electric', modelo:'PC-Compact', potenciaHP:null, voltaje:'220V', serie:'SE-90211', ubicacion:'Cuarto eléctrico nivel -1', estado:'Activo', ultMant:'2026-08-05'},
    ];

    db.mantenimientos = [
      {equipoId:'EQ-001', fecha:'2026-08-02', tipo:'Preventivo', tecnico:'Carlos Méndez', descripcion:'Cambio de sellos mecánicos y revisión de rodamientos.'},
      {equipoId:'EQ-001', fecha:'2026-04-12', tipo:'Correctivo', tecnico:'Pedro Morales', descripcion:'Reemplazo de impulsor dañado por cavitación.'},
      {equipoId:'EQ-004', fecha:'2026-09-10', tipo:'Correctivo', tecnico:'Luis Herrera', descripcion:'Falla en tarjeta de control, en diagnóstico.'},
      {equipoId:'EQ-007', fecha:'2026-05-30', tipo:'Correctivo', tecnico:'Carlos Méndez', descripcion:'Motor quemado, pendiente de reemplazo.'},
    ];

    /* --- Inventario (20 productos) --- */
    db.productos = [
      {id:'INV-001', nombre:'Rodamiento 6205-2RS', categoria:'Rodamientos', existencia:42, stockMin:10, costo:35, precio:65, proveedor:'Repuestos Industriales GT'},
      {id:'INV-002', nombre:'Rodamiento 6309-2RS', categoria:'Rodamientos', existencia:8, stockMin:10, costo:68, precio:120, proveedor:'Repuestos Industriales GT'},
      {id:'INV-003', nombre:'Contactor 3P 40A 220V', categoria:'Contactores', existencia:15, stockMin:6, costo:210, precio:380, proveedor:'ElectroSuministros S.A.'},
      {id:'INV-004', nombre:'Contactor 3P 65A 440V', categoria:'Contactores', existencia:5, stockMin:5, costo:340, precio:590, proveedor:'ElectroSuministros S.A.'},
      {id:'INV-005', nombre:'Guardamotor 9-14A', categoria:'Guardamotores', existencia:20, stockMin:8, costo:180, precio:320, proveedor:'ElectroSuministros S.A.'},
      {id:'INV-006', nombre:'Guardamotor 17-23A', categoria:'Guardamotores', existencia:3, stockMin:6, costo:225, precio:395, proveedor:'ElectroSuministros S.A.'},
      {id:'INV-007', nombre:'Breaker termomagnético 2x30A', categoria:'Breakers', existencia:25, stockMin:10, costo:95, precio:170, proveedor:'Distribuidora Eléctrica Central'},
      {id:'INV-008', nombre:'Breaker termomagnético 3x60A', categoria:'Breakers', existencia:9, stockMin:8, costo:210, precio:360, proveedor:'Distribuidora Eléctrica Central'},
      {id:'INV-009', nombre:'Cable eléctrico THHN #10 (m)', categoria:'Cable eléctrico', existencia:340, stockMin:100, costo:4.2, precio:7.5, proveedor:'Distribuidora Eléctrica Central'},
      {id:'INV-010', nombre:'Cable eléctrico THHN #12 (m)', categoria:'Cable eléctrico', existencia:60, stockMin:100, costo:2.9, precio:5.4, proveedor:'Distribuidora Eléctrica Central'},
      {id:'INV-011', nombre:'Sello mecánico 5/8"', categoria:'Sellos mecánicos', existencia:18, stockMin:8, costo:95, precio:175, proveedor:'Repuestos Industriales GT'},
      {id:'INV-012', nombre:'Sello mecánico 3/4"', categoria:'Sellos mecánicos', existencia:6, stockMin:8, costo:110, precio:198, proveedor:'Repuestos Industriales GT'},
      {id:'INV-013', nombre:'Impulsor bomba centrífuga 15HP', categoria:'Impulsores', existencia:4, stockMin:4, costo:650, precio:1150, proveedor:'Bombas y Motores de Guatemala'},
      {id:'INV-014', nombre:'Impulsor bomba sumergible 30HP', categoria:'Impulsores', existencia:2, stockMin:3, costo:980, precio:1690, proveedor:'Bombas y Motores de Guatemala'},
      {id:'INV-015', nombre:'Capacitor de arranque 30uF', categoria:'Capacitores', existencia:22, stockMin:10, costo:45, precio:85, proveedor:'ElectroSuministros S.A.'},
      {id:'INV-016', nombre:'Capacitor de marcha 15uF', categoria:'Capacitores', existencia:14, stockMin:10, costo:38, precio:72, proveedor:'ElectroSuministros S.A.'},
      {id:'INV-017', nombre:'Variador de frecuencia 5HP', categoria:'Variadores de frecuencia', existencia:2, stockMin:2, costo:3200, precio:4950, proveedor:'Automatización Industrial S.A.'},
      {id:'INV-018', nombre:'Variador de frecuencia 15HP', categoria:'Variadores de frecuencia', existencia:1, stockMin:2, costo:7800, precio:11500, proveedor:'Automatización Industrial S.A.'},
      {id:'INV-019', nombre:'Aceite dieléctrico (galón)', categoria:'Otros', existencia:30, stockMin:10, costo:120, precio:210, proveedor:'Distribuidora Eléctrica Central'},
      {id:'INV-020', nombre:'Grasa para rodamientos (lb)', categoria:'Otros', existencia:16, stockMin:8, costo:55, precio:98, proveedor:'Repuestos Industriales GT'},
    ];

    /* --- Cotizaciones (10) --- cada item: {desc,tipo(Mano de obra/Repuesto/Material/Transporte),cant,pu} */
    db.cotizaciones = [
      {id:'COT-2026-001', clienteId:'CLI-001', equipoId:'EQ-001', tipoServicio:'Mantenimiento preventivo', fecha:'2026-08-20', vigenciaDias:15, tecnicoId:'TEC-01', estado:'Aprobada', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra - revisión general', tipo:'Mano de obra', cant:4, pu:150},{desc:'Sello mecánico 5/8"', tipo:'Repuestos', cant:1, pu:175},{desc:'Grasa para rodamientos (lb)', tipo:'Materiales', cant:2, pu:98},{desc:'Transporte a sitio', tipo:'Transporte', cant:1, pu:150}]},
      {id:'COT-2026-002', clienteId:'CLI-002', equipoId:'EQ-004', tipoServicio:'Diagnóstico y reparación', fecha:'2026-09-08', vigenciaDias:10, tecnicoId:'TEC-03', estado:'Aprobada', descuentoPct:5, impuestoPct:12,
        items:[{desc:'Mano de obra - diagnóstico electrónico', tipo:'Mano de obra', cant:6, pu:180},{desc:'Variador de frecuencia 15HP', tipo:'Repuestos', cant:1, pu:11500},{desc:'Transporte especializado', tipo:'Transporte', cant:1, pu:300}]},
      {id:'COT-2026-003', clienteId:'CLI-003', equipoId:'EQ-005', tipoServicio:'Mantenimiento correctivo', fecha:'2026-09-01', vigenciaDias:15, tecnicoId:'TEC-04', estado:'Enviada', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra - cambio de rodamientos', tipo:'Mano de obra', cant:3, pu:150},{desc:'Rodamiento 6309-2RS', tipo:'Repuestos', cant:2, pu:120},{desc:'Transporte', tipo:'Transporte', cant:1, pu:120}]},
      {id:'COT-2026-004', clienteId:'CLI-004', equipoId:'EQ-006', tipoServicio:'Mantenimiento preventivo', fecha:'2026-09-05', vigenciaDias:15, tecnicoId:'TEC-02', estado:'Borrador', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra', tipo:'Mano de obra', cant:3, pu:150},{desc:'Capacitor de arranque 30uF', tipo:'Repuestos', cant:1, pu:85}]},
      {id:'COT-2026-005', clienteId:'CLI-005', equipoId:'EQ-008', tipoServicio:'Mantenimiento preventivo', fecha:'2026-08-15', vigenciaDias:15, tecnicoId:'TEC-01', estado:'Aprobada', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra - revisión de motor', tipo:'Mano de obra', cant:5, pu:150},{desc:'Rodamiento 6205-2RS', tipo:'Repuestos', cant:2, pu:65},{desc:'Transporte', tipo:'Transporte', cant:1, pu:180}]},
      {id:'COT-2026-006', clienteId:'CLI-006', equipoId:'EQ-010', tipoServicio:'Mantenimiento correctivo', fecha:'2026-08-25', vigenciaDias:10, tecnicoId:'TEC-04', estado:'Rechazada', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra', tipo:'Mano de obra', cant:8, pu:150},{desc:'Impulsor bomba centrífuga 15HP', tipo:'Repuestos', cant:1, pu:1150},{desc:'Transporte', tipo:'Transporte', cant:1, pu:250}]},
      {id:'COT-2026-007', clienteId:'CLI-007', equipoId:'EQ-011', tipoServicio:'Mantenimiento preventivo', fecha:'2026-07-28', vigenciaDias:15, tecnicoId:'TEC-02', estado:'Vencida', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra', tipo:'Mano de obra', cant:4, pu:150},{desc:'Capacitor de marcha 15uF', tipo:'Repuestos', cant:1, pu:72}]},
      {id:'COT-2026-008', clienteId:'CLI-008', equipoId:'EQ-013', tipoServicio:'Inspección técnica', fecha:'2026-09-12', vigenciaDias:15, tecnicoId:'TEC-01', estado:'Enviada', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra - inspección', tipo:'Mano de obra', cant:2, pu:150},{desc:'Transporte municipal', tipo:'Transporte', cant:1, pu:200}]},
      {id:'COT-2026-009', clienteId:'CLI-010', equipoId:'EQ-014', tipoServicio:'Mantenimiento preventivo', fecha:'2026-09-14', vigenciaDias:15, tecnicoId:'TEC-03', estado:'Aprobada', descuentoPct:10, impuestoPct:12,
        items:[{desc:'Mano de obra', tipo:'Mano de obra', cant:4, pu:150},{desc:'Sello mecánico 3/4"', tipo:'Repuestos', cant:1, pu:198},{desc:'Transporte', tipo:'Transporte', cant:1, pu:150}]},
      {id:'COT-2026-010', clienteId:'CLI-002', equipoId:'EQ-003', tipoServicio:'Mantenimiento preventivo', fecha:'2026-09-16', vigenciaDias:15, tecnicoId:'TEC-04', estado:'Borrador', descuentoPct:0, impuestoPct:12,
        items:[{desc:'Mano de obra', tipo:'Mano de obra', cant:3, pu:150},{desc:'Rodamiento 6205-2RS', tipo:'Repuestos', cant:2, pu:65}]},
    ];

    /* --- Órdenes de trabajo (13) --- */
    db.ordenes = [
      {id:'OT-2026-001', cotizacionId:'COT-2026-001', clienteId:'CLI-001', equipoId:'EQ-001', tecnicoId:'TEC-01', fecha:'2026-08-22', hora:'08:00', prioridad:'Media', tipoServicio:'Mantenimiento preventivo', descripcion:'Revisión general de bomba sumergible y cambio de sello mecánico.', estado:'Finalizada',
        ejecucion:{horaInicio:'08:10', horaFin:'11:40', diagnostico:'Sello mecánico con fuga leve, rodamientos en buen estado.', trabajo:'Se sustituyó el sello mecánico y se realizó limpieza general del equipo.', mediciones:'Corriente: 42A / Voltaje: 458V / Vibración: normal', repuestos:[{productoId:'INV-011', cantidad:1}], observaciones:'Equipo operando dentro de parámetros normales.', recomendaciones:'Próximo mantenimiento preventivo en 6 meses.', fotos:3, firmaTecnico:true, firmaCliente:true}},
      {id:'OT-2026-002', cotizacionId:'COT-2026-002', clienteId:'CLI-002', equipoId:'EQ-004', tecnicoId:'TEC-03', fecha:'2026-09-11', hora:'09:00', prioridad:'Alta', tipoServicio:'Diagnóstico y reparación', descripcion:'Variador de frecuencia presenta falla intermitente y se apaga bajo carga.', estado:'Finalizada',
        ejecucion:{horaInicio:'09:05', horaFin:'15:20', diagnostico:'Tarjeta de control dañada por sobretensión.', trabajo:'Se reemplazó el variador de frecuencia completo y se reconfiguraron parámetros de fábrica.', mediciones:'Corriente: 28A / Voltaje: 442V', repuestos:[{productoId:'INV-018', cantidad:1}], observaciones:'Se recomienda instalar protector de sobretensión.', recomendaciones:'Instalar supresor de picos en el tablero principal.', fotos:5, firmaTecnico:true, firmaCliente:true}},
      {id:'OT-2026-003', cotizacionId:'COT-2026-005', clienteId:'CLI-005', equipoId:'EQ-008', tecnicoId:'TEC-01', fecha:'2026-08-18', hora:'07:30', prioridad:'Media', tipoServicio:'Mantenimiento preventivo', descripcion:'Mantenimiento preventivo de motor trifásico en telares.', estado:'Finalizada',
        ejecucion:{horaInicio:'07:35', horaFin:'11:00', diagnostico:'Rodamientos con desgaste normal por uso.', trabajo:'Cambio de rodamientos y lubricación general.', mediciones:'Corriente: 33A / Temperatura: 58°C', repuestos:[{productoId:'INV-001', cantidad:2}], observaciones:'Motor operando correctamente.', recomendaciones:'Monitorear temperatura mensualmente.', fotos:4, firmaTecnico:true, firmaCliente:true}},
      {id:'OT-2026-004', cotizacionId:'COT-2026-009', clienteId:'CLI-010', equipoId:'EQ-014', tecnicoId:'TEC-03', fecha:'2026-09-19', hora:'10:00', prioridad:'Media', tipoServicio:'Mantenimiento preventivo', descripcion:'Mantenimiento del sistema contra incendios previo a inspección municipal.', estado:'En proceso',
        ejecucion:{horaInicio:'10:05', horaFin:null, diagnostico:'En evaluación.', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-005', cotizacionId:null, clienteId:'CLI-007', equipoId:'EQ-012', tecnicoId:'TEC-02', fecha:'2026-09-19', hora:'13:00', prioridad:'Alta', tipoServicio:'Inspección técnica', descripcion:'Variador con alarma de sobrecorriente intermitente en cuarto de máquinas.', estado:'Programada',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-006', cotizacionId:null, clienteId:'CLI-003', equipoId:'EQ-005', tecnicoId:'TEC-04', fecha:'2026-09-20', hora:'08:00', prioridad:'Media', tipoServicio:'Mantenimiento correctivo', descripcion:'Ruido anormal en bomba centrífuga de área de despacho.', estado:'Programada',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-007', cotizacionId:null, clienteId:'CLI-004', equipoId:'EQ-007', tecnicoId:'TEC-01', fecha:'2026-09-22', hora:'09:00', prioridad:'Alta', tipoServicio:'Mantenimiento correctivo', descripcion:'Bomba sumergible de cisterna fuera de servicio, motor posiblemente quemado.', estado:'Pendiente',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-008', cotizacionId:null, clienteId:'CLI-008', equipoId:'EQ-013', tecnicoId:'TEC-02', fecha:'2026-09-23', hora:'14:00', prioridad:'Baja', tipoServicio:'Inspección técnica', descripcion:'Inspección anual programada por la municipalidad.', estado:'Pendiente',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-009', cotizacionId:null, clienteId:'CLI-002', equipoId:'EQ-003', tecnicoId:'TEC-04', fecha:'2026-09-19', hora:'15:00', prioridad:'Media', tipoServicio:'Mantenimiento preventivo', descripcion:'Mantenimiento programado de motor en línea de producción 1.', estado:'Programada',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-010', cotizacionId:null, clienteId:'CLI-001', equipoId:'EQ-002', tecnicoId:'TEC-02', fecha:'2026-08-30', hora:'08:00', prioridad:'Media', tipoServicio:'Mantenimiento preventivo', descripcion:'Revisión de panel de control de caseta de bombeo.', estado:'Cancelada',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'Cliente reprogramará para el próximo trimestre.', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-011', cotizacionId:null, clienteId:'CLI-009', equipoId:null, tecnicoId:'TEC-01', fecha:'2026-09-05', hora:'10:00', prioridad:'Baja', tipoServicio:'Inspección técnica', descripcion:'Visita de evaluación general de planta.', estado:'En espera',
        ejecucion:{horaInicio:'10:15', horaFin:null, diagnostico:'Se requiere autorización adicional del cliente para continuar.', trabajo:'', mediciones:'', repuestos:[], observaciones:'A la espera de aprobación de presupuesto ampliado.', recomendaciones:'', fotos:1, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-012', cotizacionId:null, clienteId:'CLI-006', equipoId:'EQ-010', tecnicoId:'TEC-03', fecha:'2026-09-25', hora:'08:30', prioridad:'Media', tipoServicio:'Mantenimiento preventivo', descripcion:'Mantenimiento preventivo trimestral del sistema de riego.', estado:'Pendiente',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
      {id:'OT-2026-013', cotizacionId:null, clienteId:'CLI-005', equipoId:'EQ-009', tecnicoId:'TEC-01', fecha:'2026-09-19', hora:'11:00', prioridad:'Alta', tipoServicio:'Mantenimiento correctivo', descripcion:'Panel de control con falla en breaker principal.', estado:'Programada',
        ejecucion:{horaInicio:null, horaFin:null, diagnostico:'', trabajo:'', mediciones:'', repuestos:[], observaciones:'', recomendaciones:'', fotos:0, firmaTecnico:false, firmaCliente:false}},
    ];

    /* --- Facturas (6) y Pagos (5) --- */
    db.facturas = [
      {id:'FAC-2026-101', clienteId:'CLI-001', ordenId:'OT-2026-001', fecha:'2026-08-23', subtotal:775, impuesto:93, total:868, estado:'Pagada'},
      {id:'FAC-2026-102', clienteId:'CLI-002', ordenId:'OT-2026-002', fecha:'2026-09-12', subtotal:17575, impuesto:2001.85, total:19453.15, estado:'Parcial'},
      {id:'FAC-2026-103', clienteId:'CLI-005', ordenId:'OT-2026-003', fecha:'2026-08-19', subtotal:940, impuesto:112.8, total:1052.8, estado:'Pagada'},
      {id:'FAC-2026-104', clienteId:'CLI-003', ordenId:null, fecha:'2026-07-30', subtotal:1620, impuesto:194.4, total:1814.4, estado:'Vencida'},
      {id:'FAC-2026-105', clienteId:'CLI-010', ordenId:null, fecha:'2026-08-10', subtotal:1250, impuesto:150, total:1400, estado:'Pendiente'},
      {id:'FAC-2026-106', clienteId:'CLI-004', ordenId:null, fecha:'2026-06-25', subtotal:2200, impuesto:264, total:2464, estado:'Anulada'},
    ];
    db.pagos = [
      {id:'PAG-001', facturaId:'FAC-2026-101', clienteId:'CLI-001', fecha:'2026-08-24', metodo:'Transferencia', monto:868},
      {id:'PAG-002', facturaId:'FAC-2026-102', clienteId:'CLI-002', fecha:'2026-09-13', metodo:'Transferencia', monto:12000},
      {id:'PAG-003', facturaId:'FAC-2026-103', clienteId:'CLI-005', fecha:'2026-08-20', metodo:'Cheque', monto:1052.8},
      {id:'PAG-004', facturaId:'FAC-2026-105', clienteId:'CLI-010', fecha:'2026-08-15', metodo:'Efectivo', monto:600},
      {id:'PAG-005', facturaId:'FAC-2026-104', clienteId:'CLI-003', fecha:'2026-08-05', metodo:'Tarjeta', monto:400},
    ];

    /* --- Gastos (12) --- */
    db.gastos = [
      {id:'GAS-001', fecha:'2026-09-02', categoria:'Combustible', descripcion:'Combustible vehículos de servicio técnico', proveedor:'Estación Puma Zona 10', monto:850, impuestoPct:12},
      {id:'GAS-002', fecha:'2026-09-03', categoria:'Compra de repuestos', descripcion:'Reposición de stock de rodamientos', proveedor:'Repuestos Industriales GT', monto:3200, impuestoPct:12},
      {id:'GAS-003', fecha:'2026-09-05', categoria:'Herramientas', descripcion:'Multímetro digital y pinza amperimétrica', proveedor:'Ferretería Total', monto:1450, impuestoPct:12},
      {id:'GAS-004', fecha:'2026-09-06', categoria:'Transporte', descripcion:'Servicio de grúa para traslado de motor', proveedor:'Grúas del Norte', monto:600, impuestoPct:12},
      {id:'GAS-005', fecha:'2026-09-08', categoria:'Servicios', descripcion:'Pago de energía eléctrica del taller', proveedor:'EEGSA', monto:980, impuestoPct:0},
      {id:'GAS-006', fecha:'2026-09-09', categoria:'Administración', descripcion:'Papelería y suministros de oficina', proveedor:'Office Depot', monto:320, impuestoPct:12},
      {id:'GAS-007', fecha:'2026-09-10', categoria:'Compra de repuestos', descripcion:'Variadores de frecuencia para stock', proveedor:'Automatización Industrial S.A.', monto:7800, impuestoPct:12},
      {id:'GAS-008', fecha:'2026-09-11', categoria:'Combustible', descripcion:'Combustible unidad 2', proveedor:'Estación Shell Boulevard', monto:720, impuestoPct:12},
      {id:'GAS-009', fecha:'2026-09-12', categoria:'Otros', descripcion:'Uniformes y equipo de protección personal', proveedor:'Seguridad Industrial GT', monto:1100, impuestoPct:12},
      {id:'GAS-010', fecha:'2026-09-14', categoria:'Administración', descripcion:'Servicio de internet y telefonía', proveedor:'Tigo Empresas', monto:540, impuestoPct:12},
      {id:'GAS-011', fecha:'2026-09-15', categoria:'Transporte', descripcion:'Peajes y estacionamientos', proveedor:'Varios', monto:180, impuestoPct:0},
      {id:'GAS-012', fecha:'2026-09-17', categoria:'Herramientas', descripcion:'Mantenimiento de equipo de taller', proveedor:'Ferretería Total', monto:410, impuestoPct:12},
    ];

    db.bitacora = [
      {fecha:'2026-09-19 08:02', usuario:'Ana Gutiérrez', accion:'Inicio de sesión', detalle:'Acceso exitoso como Administrador'},
      {fecha:'2026-09-18 16:40', usuario:'Carlos Méndez', accion:'Finalizó orden', detalle:'OT-2026-001 marcada como Finalizada'},
      {fecha:'2026-09-18 11:15', usuario:'María López', accion:'Generó factura', detalle:'FAC-2026-102 generada desde OT-2026-002'},
      {fecha:'2026-09-17 09:30', usuario:'Ana Gutiérrez', accion:'Aprobó cotización', detalle:'COT-2026-009 cambió a Aprobada'},
      {fecha:'2026-09-16 14:05', usuario:'José Ramírez', accion:'Inicio de sesión', detalle:'Acceso exitoso como Técnico'},
      {fecha:'2026-09-15 10:22', usuario:'María López', accion:'Registró pago', detalle:'PAG-002 por Q 12,000.00 aplicado a FAC-2026-102'},
    ];

    db.notificaciones = [
      {titulo:'Stock bajo', detalle:'6 productos por debajo del stock mínimo', tipo:'alert'},
      {titulo:'Factura vencida', detalle:'FAC-2026-104 se encuentra vencida', tipo:'alert'},
      {titulo:'Cotización por vencer', detalle:'COT-2026-008 vence en 5 días', tipo:'info'},
      {titulo:'Orden asignada', detalle:'OT-2026-013 asignada a Carlos Méndez', tipo:'info'},
    ];

    desplazarFechas(db, L.diasEntre(REF, hoy));
    return db;
  }

  /** Desplaza todas las fechas de la base de datos `dias` días. */
  function desplazarFechas(db, dias) {
    if (!dias) return;
    const sh = s => (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}/.test(s)) ? L.addDays(s.slice(0, 10), dias) + s.slice(10) : s;
    db.equipos.forEach(e => { e.ultMant = sh(e.ultMant); });
    db.mantenimientos.forEach(m => { m.fecha = sh(m.fecha); });
    db.usuarios.forEach(u => { u.ultimoAcceso = sh(u.ultimoAcceso); });
    ['cotizaciones', 'ordenes', 'facturas', 'pagos', 'gastos', 'bitacora'].forEach(k => db[k].forEach(x => { x.fecha = sh(x.fecha); }));
  }

  return { crearDatosDemo, desplazarFechas, FECHA_REFERENCIA };
});
