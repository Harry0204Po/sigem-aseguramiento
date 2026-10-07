/* =========================================================================
   SIGEM — Lógica de negocio
   Módulo independiente de la interfaz: no usa el DOM ni variables globales.
   Todas las funciones reciben la base de datos (`db`) como parámetro, por lo
   que pueden ejecutarse en el navegador y en Node.js (pruebas automatizadas).
   Las operaciones que modifican datos devuelven { ok, error|errores, ... }.
   ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SIGEM_LOGICA = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------------------- Catálogos ---------------------------- */
  const ROLES = ['Administrador', 'Administrativo', 'Técnico'];
  const TIPOS_EQUIPO = ['Bomba centrífuga', 'Bomba sumergible', 'Motor eléctrico', 'Panel de control', 'Variador de frecuencia'];
  const ESTADOS_EQUIPO = ['Activo', 'En mantenimiento', 'Fuera de servicio', 'Inactivo'];
  const ESTADOS_COT = ['Borrador', 'Enviada', 'Aprobada', 'Rechazada', 'Vencida'];
  const ESTADOS_ORD = ['Pendiente', 'Programada', 'En proceso', 'En espera', 'Finalizada', 'Cancelada'];
  const ESTADOS_ORD_ACTIVOS = ['Pendiente', 'Programada', 'En proceso', 'En espera'];
  const ESTADOS_FAC = ['Pendiente', 'Pagada', 'Parcial', 'Vencida', 'Anulada'];
  const PRIORIDADES = ['Alta', 'Media', 'Baja'];
  const METODOS_PAGO = ['Transferencia', 'Efectivo', 'Cheque', 'Tarjeta'];
  const CATS_GASTO = ['Combustible', 'Transporte', 'Compra de repuestos', 'Herramientas', 'Servicios', 'Administración', 'Otros'];
  const TIPOS_LINEA = ['Mano de obra', 'Repuestos', 'Materiales', 'Transporte'];
  /** Tarifa aplicada a órdenes creadas sin cotización (servicios de emergencia o inspecciones). */
  const TARIFA_SIN_COTIZACION = { manoObra: 800, visita: 150, ivaPct: 12 };

  /** Permisos por vista (control de acceso basado en roles, RBAC). */
  const PERMISOS = {
    'dashboard':     ['Administrador', 'Administrativo', 'Técnico'],
    'clientes':      ['Administrador', 'Administrativo'],
    'equipos':       ['Administrador', 'Administrativo'],
    'cotizaciones':  ['Administrador', 'Administrativo'],
    'ordenes':       ['Administrador', 'Administrativo'],
    'panel-tecnico': ['Técnico'],
    'inventario':    ['Administrador'],
    'facturacion':   ['Administrador', 'Administrativo'],
    'pagos':         ['Administrador', 'Administrativo'],
    'gastos':        ['Administrador'],
    'rentabilidad':  ['Administrador'],
    'reportes':      ['Administrador'],
    'usuarios':      ['Administrador'],
    'guia':          ['Administrador', 'Administrativo', 'Técnico'],
  };

  /* ---------------------------- Utilidades ---------------------------- */
  const pad2 = n => String(n).padStart(2, '0');
  function ymd(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function todayStr() { return ymd(new Date()); }
  function ahoraStr() { const d = new Date(); return ymd(d) + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
  function horaActual() { const d = new Date(); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
  function addDays(str, n) { const d = new Date(str + 'T00:00:00'); d.setDate(d.getDate() + n); return ymd(d); }
  function diasEntre(desde, hasta) { return Math.round((new Date(hasta + 'T00:00:00') - new Date(desde + 'T00:00:00')) / 86400000); }
  function esFechaValida(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00:00')); }
  function esHoraValida(s) { return typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s); }
  function enUltimos30(f, hoy) { hoy = hoy || todayStr(); return !!f && f >= addDays(hoy, -30) && f <= hoy; }
  function ultimosMeses(n, base) {
    const m = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const d = base || new Date(); const out = [];
    for (let i = n - 1; i >= 0; i--) out.push(m[new Date(d.getFullYear(), d.getMonth() - i, 1).getMonth()]);
    return out;
  }
  function redondear(n) { return Math.round((Number(n) || 0) * 100) / 100; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function byId(arr, id) { return arr.find(x => x.id === id); }
  function texto(v) { return String(v == null ? '' : v).trim(); }
  function esCorreoValido(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); }
  function esTelefonoValido(s) { return /^\d{4}-?\d{4}$/.test(s); }
  function siguienteId(prefijo, lista, ancho) {
    let max = 0;
    lista.forEach(x => { const m = String(x.id).match(/(\d+)$/); if (m && String(x.id).startsWith(prefijo)) max = Math.max(max, +m[1]); });
    return prefijo + String(max + 1).padStart(ancho, '0');
  }
  function registrarBitacora(db, usuario, accion, detalle) {
    db.bitacora.unshift({ fecha: ahoraStr(), usuario: usuario ? usuario.nombre : 'Sistema', accion: accion, detalle: detalle });
  }

  /* ---------------------------- Seguridad ---------------------------- */
  /** Autentica un usuario. Solo usuarios activos pueden ingresar. */
  function autenticar(db, email, pass) {
    const correo = texto(email).toLowerCase();
    if (!correo || !pass) return { ok: false, error: 'Ingrese su correo y contraseña.' };
    const u = db.usuarios.find(x => x.email.toLowerCase() === correo);
    if (!u || u.pass !== pass) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    if (u.estado !== 'Activo') return { ok: false, error: 'El usuario está inactivo. Contacte al administrador.' };
    return { ok: true, usuario: u };
  }
  function vistasPermitidas(rol) { return Object.keys(PERMISOS).filter(v => PERMISOS[v].includes(rol)); }
  function puedeAcceder(rol, vista) { return !!PERMISOS[vista] && PERMISOS[vista].includes(rol); }
  function vistaInicio(rol) { return rol === 'Técnico' ? 'panel-tecnico' : 'dashboard'; }

  /* ---------------------------- Clientes ---------------------------- */
  function validarCliente(db, data, idActual) {
    const e = [];
    if (!texto(data.nombre)) e.push('El nombre del cliente es obligatorio.');
    if (!texto(data.nit)) e.push('El NIT es obligatorio.');
    else if (db.clientes.some(c => c.id !== idActual && c.nit.toLowerCase() === texto(data.nit).toLowerCase())) e.push('Ya existe un cliente registrado con ese NIT.');
    if (texto(data.correo) && !esCorreoValido(texto(data.correo))) e.push('El correo electrónico no tiene un formato válido.');
    if (texto(data.telefono) && !esTelefonoValido(texto(data.telefono))) e.push('El teléfono debe tener 8 dígitos (ej. 2234-1122).');
    return e;
  }
  function normalizarCliente(data) {
    const nombre = texto(data.nombre);
    return { nombre: nombre, empresa: texto(data.empresa) || nombre, nit: texto(data.nit), telefono: texto(data.telefono),
      correo: texto(data.correo), direccion: texto(data.direccion), estado: data.estado === 'Inactivo' ? 'Inactivo' : 'Activo' };
  }
  function crearCliente(db, data, usuario) {
    const errores = validarCliente(db, data);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    const cliente = Object.assign({ id: siguienteId('CLI-', db.clientes, 3) }, normalizarCliente(data));
    db.clientes.push(cliente);
    registrarBitacora(db, usuario, 'Registró cliente', cliente.id + ' - ' + cliente.nombre);
    return { ok: true, cliente: cliente };
  }
  function actualizarCliente(db, id, data, usuario) {
    const c = byId(db.clientes, id);
    if (!c) return { ok: false, error: 'Cliente no encontrado.' };
    const errores = validarCliente(db, data, id);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    Object.assign(c, normalizarCliente(data));
    registrarBitacora(db, usuario, 'Actualizó cliente', id);
    return { ok: true, cliente: c };
  }

  /* ---------------------------- Equipos ---------------------------- */
  function validarEquipo(db, data, idActual) {
    const e = [];
    if (!byId(db.clientes, data.clienteId)) e.push('Seleccione un cliente válido.');
    if (!TIPOS_EQUIPO.includes(data.tipo)) e.push('Seleccione un tipo de equipo válido.');
    if (!texto(data.marca)) e.push('La marca es obligatoria.');
    if (!texto(data.serie)) e.push('El número de serie es obligatorio.');
    else if (db.equipos.some(x => x.id !== idActual && x.serie.toLowerCase() === texto(data.serie).toLowerCase())) e.push('Ya existe un equipo con ese número de serie.');
    if (data.potenciaHP != null && data.potenciaHP !== '' && !(Number(data.potenciaHP) > 0)) e.push('La potencia debe ser un número mayor que 0.');
    return e;
  }
  function normalizarEquipo(data) {
    const hp = data.potenciaHP === '' || data.potenciaHP == null ? null : Number(data.potenciaHP);
    return { clienteId: data.clienteId, tipo: data.tipo, marca: texto(data.marca), modelo: texto(data.modelo), potenciaHP: hp,
      voltaje: texto(data.voltaje), serie: texto(data.serie), ubicacion: texto(data.ubicacion),
      estado: ESTADOS_EQUIPO.includes(data.estado) ? data.estado : 'Activo', ultMant: data.ultMant || null };
  }
  function crearEquipo(db, data, usuario) {
    const errores = validarEquipo(db, data);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    const equipo = Object.assign({ id: siguienteId('EQ-', db.equipos, 3) }, normalizarEquipo(data));
    db.equipos.push(equipo);
    registrarBitacora(db, usuario, 'Registró equipo', equipo.id + ' - ' + equipo.tipo);
    return { ok: true, equipo: equipo };
  }
  function actualizarEquipo(db, id, data, usuario) {
    const eq = byId(db.equipos, id);
    if (!eq) return { ok: false, error: 'Equipo no encontrado.' };
    const errores = validarEquipo(db, data, id);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    Object.assign(eq, normalizarEquipo(data));
    registrarBitacora(db, usuario, 'Actualizó equipo', id);
    return { ok: true, equipo: eq };
  }

  /* ---------------------------- Cotizaciones ---------------------------- */
  /** Calcula subtotal, descuento, impuesto y total de una lista de líneas {cant, pu}. */
  function calcTotales(items, descuentoPct, impuestoPct) {
    const subtotal = (items || []).reduce((s, i) => s + (Number(i.cant) || 0) * (Number(i.pu) || 0), 0);
    const descuento = subtotal * (Number(descuentoPct) || 0) / 100;
    const base = subtotal - descuento;
    const impuesto = base * (Number(impuestoPct) || 0) / 100;
    return { subtotal: redondear(subtotal), descuento: redondear(descuento), base: redondear(base), impuesto: redondear(impuesto), total: redondear(base + impuesto) };
  }
  function validarCotizacion(db, data) {
    const e = [];
    if (!byId(db.clientes, data.clienteId)) e.push('Seleccione un cliente válido.');
    const eq = byId(db.equipos, data.equipoId);
    if (!eq) e.push('El cliente seleccionado no tiene equipos registrados. Registre un equipo primero.');
    else if (eq.clienteId !== data.clienteId) e.push('El equipo no pertenece al cliente seleccionado.');
    if (!esFechaValida(data.fecha)) e.push('Ingrese una fecha válida.');
    if (!(Number(data.vigenciaDias) > 0)) e.push('La vigencia debe ser mayor que 0 días.');
    const desc = Number(data.descuentoPct) || 0, imp = Number(data.impuestoPct) || 0;
    if (desc < 0 || desc > 100) e.push('El descuento debe estar entre 0 y 100%.');
    if (imp < 0 || imp > 100) e.push('El impuesto debe estar entre 0 y 100%.');
    const items = (data.items || []).filter(i => texto(i.desc));
    if (!items.length) e.push('Agregue al menos una línea de detalle.');
    if (items.some(i => !(Number(i.cant) > 0))) e.push('La cantidad de cada línea debe ser mayor que 0.');
    if (items.some(i => Number(i.pu) < 0 || isNaN(Number(i.pu)))) e.push('El precio unitario no puede ser negativo.');
    return e;
  }
  function normalizarCotizacion(data) {
    return { clienteId: data.clienteId, equipoId: data.equipoId, tipoServicio: texto(data.tipoServicio) || 'Mantenimiento preventivo',
      tecnicoId: data.tecnicoId, fecha: data.fecha, vigenciaDias: Number(data.vigenciaDias),
      descuentoPct: Number(data.descuentoPct) || 0, impuestoPct: Number(data.impuestoPct) || 0,
      items: (data.items || []).filter(i => texto(i.desc)).map(i => ({ desc: texto(i.desc), tipo: i.tipo, cant: Number(i.cant), pu: Number(i.pu) })) };
  }
  function crearCotizacion(db, data, usuario) {
    const errores = validarCotizacion(db, data);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    const cot = Object.assign({ id: siguienteId('COT-2026-', db.cotizaciones, 3), estado: 'Borrador' }, normalizarCotizacion(data));
    db.cotizaciones.push(cot);
    registrarBitacora(db, usuario, 'Creó cotización', cot.id);
    return { ok: true, cotizacion: cot };
  }
  function actualizarCotizacion(db, id, data, usuario) {
    const c = byId(db.cotizaciones, id);
    if (!c) return { ok: false, error: 'Cotización no encontrada.' };
    if (db.ordenes.some(o => o.cotizacionId === id)) return { ok: false, error: 'No se puede editar: la cotización ya generó una orden de trabajo.' };
    const errores = validarCotizacion(db, data);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    Object.assign(c, normalizarCotizacion(data));
    registrarBitacora(db, usuario, 'Actualizó cotización', id);
    return { ok: true, cotizacion: c };
  }
  function cambiarEstadoCotizacion(db, id, nuevoEstado, usuario) {
    const c = byId(db.cotizaciones, id);
    if (!c) return { ok: false, error: 'Cotización no encontrada.' };
    if (!ESTADOS_COT.includes(nuevoEstado)) return { ok: false, error: 'Estado de cotización no válido.' };
    if (db.ordenes.some(o => o.cotizacionId === id) && nuevoEstado !== 'Aprobada') return { ok: false, error: 'La cotización ya tiene una orden de trabajo generada; no puede cambiar de estado.' };
    const anterior = c.estado;
    c.estado = nuevoEstado;
    registrarBitacora(db, usuario, 'Cambió estado de cotización', id + ': ' + anterior + ' → ' + nuevoEstado);
    return { ok: true, cotizacion: c, anterior: anterior };
  }
  function fechaVencimientoCotizacion(c) { return addDays(c.fecha, c.vigenciaDias); }

  /* ---------------------------- Órdenes de trabajo ---------------------------- */
  function ejecucionVacia() {
    return { horaInicio: null, horaFin: null, diagnostico: '', trabajo: '', mediciones: '', repuestos: [], observaciones: '', recomendaciones: '', fotos: 0, firmaTecnico: false, firmaCliente: false };
  }
  /** Devuelve la orden que choca con el horario indicado (mismo técnico, fecha y hora), o undefined. */
  function checkScheduleConflict(db, tecnicoId, fecha, hora, excludeOrderId) {
    return db.ordenes.find(o => o.tecnicoId === tecnicoId && o.fecha === fecha && o.hora === hora &&
      o.id !== excludeOrderId && o.estado !== 'Cancelada');
  }
  function validarOrden(db, data, idActual) {
    const e = [];
    if (!byId(db.clientes, data.clienteId)) e.push('Seleccione un cliente válido.');
    if (data.equipoId) { const eq = byId(db.equipos, data.equipoId); if (!eq || eq.clienteId !== data.clienteId) e.push('El equipo no pertenece al cliente seleccionado.'); }
    if (!byId(db.tecnicos, data.tecnicoId)) e.push('Seleccione un técnico válido.');
    if (!esFechaValida(data.fecha)) e.push('Ingrese una fecha programada válida.');
    if (!esHoraValida(data.hora)) e.push('Ingrese una hora válida.');
    if (!PRIORIDADES.includes(data.prioridad)) e.push('Seleccione una prioridad válida.');
    if (!ESTADOS_ORD.includes(data.estado)) e.push('Seleccione un estado válido.');
    if (data.estado === 'Finalizada' && !(idActual && byId(db.ordenes, idActual) && byId(db.ordenes, idActual).estado === 'Finalizada'))
      e.push('Una orden solo puede finalizarse desde el panel técnico ("Finalizar servicio").');
    if (!texto(data.descripcion)) e.push('La descripción del problema es obligatoria.');
    if (!e.length) {
      const c = checkScheduleConflict(db, data.tecnicoId, data.fecha, data.hora, idActual);
      if (c) e.push('Conflicto de agenda: el técnico ya tiene la orden ' + c.id + ' en ese horario.');
    }
    return e;
  }
  function normalizarOrden(data) {
    return { clienteId: data.clienteId, equipoId: data.equipoId || null, tecnicoId: data.tecnicoId, tipoServicio: texto(data.tipoServicio) || 'Mantenimiento preventivo',
      fecha: data.fecha, hora: data.hora, prioridad: data.prioridad, estado: data.estado, descripcion: texto(data.descripcion) };
  }
  function crearOrden(db, data, usuario) {
    const errores = validarOrden(db, data);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    const o = Object.assign({ id: siguienteId('OT-2026-', db.ordenes, 3), cotizacionId: null, ejecucion: ejecucionVacia() }, normalizarOrden(data));
    db.ordenes.push(o);
    registrarBitacora(db, usuario, 'Creó orden de trabajo', o.id);
    return { ok: true, orden: o };
  }
  function actualizarOrden(db, id, data, usuario) {
    const o = byId(db.ordenes, id);
    if (!o) return { ok: false, error: 'Orden no encontrada.' };
    const errores = validarOrden(db, data, id);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    Object.assign(o, normalizarOrden(data));
    registrarBitacora(db, usuario, 'Actualizó orden de trabajo', id);
    return { ok: true, orden: o };
  }
  /** Genera una orden de trabajo a partir de una cotización aprobada (una sola orden por cotización). */
  function crearOrdenDesdeCotizacion(db, cotizacionId, usuario, hoy) {
    const cot = byId(db.cotizaciones, cotizacionId);
    if (!cot) return { ok: false, error: 'Cotización no encontrada.' };
    if (cot.estado !== 'Aprobada') return { ok: false, error: 'Solo se puede generar una orden desde una cotización Aprobada.' };
    if (db.ordenes.some(o => o.cotizacionId === cotizacionId)) return { ok: false, error: 'Ya existe una orden de trabajo para esta cotización.' };
    let fecha = addDays(hoy || todayStr(), 2), hora = '08:00';
    const horas = ['08:00', '10:00', '13:00', '15:00'];
    for (let i = 0; checkScheduleConflict(db, cot.tecnicoId, fecha, hora) && i < 40; i++) {
      const j = horas.indexOf(hora) + 1;
      if (j < horas.length) hora = horas[j]; else { hora = horas[0]; fecha = addDays(fecha, 1); }
    }
    const o = { id: siguienteId('OT-2026-', db.ordenes, 3), cotizacionId: cot.id, clienteId: cot.clienteId, equipoId: cot.equipoId, tecnicoId: cot.tecnicoId,
      fecha: fecha, hora: hora, prioridad: 'Media', tipoServicio: cot.tipoServicio,
      descripcion: 'Generada automáticamente desde cotización ' + cot.id + '.', estado: 'Pendiente', ejecucion: ejecucionVacia() };
    db.ordenes.push(o);
    registrarBitacora(db, usuario, 'Generó orden de trabajo', o.id + ' generada desde ' + cot.id);
    return { ok: true, orden: o };
  }
  /** Devuelve los repuestos cuya cantidad solicitada supera la existencia. */
  function validarRepuestos(db, repuestos) {
    return (repuestos || []).filter(r => { const p = byId(db.productos, r.productoId); return !p || !(Number(r.cantidad) > 0) || Number(r.cantidad) > p.existencia; });
  }
  /** Agrupa líneas repetidas del mismo producto sumando cantidades. */
  function agruparRepuestos(repuestos) {
    const map = {};
    (repuestos || []).forEach(r => { map[r.productoId] = (map[r.productoId] || 0) + (Number(r.cantidad) || 0); });
    return Object.keys(map).map(k => ({ productoId: k, cantidad: map[k] }));
  }
  /** Finaliza el servicio: registra ejecución, descuenta inventario, actualiza el equipo y cambia el estado. */
  function finalizarOrden(db, ordenId, ejecucion, usuario) {
    const o = byId(db.ordenes, ordenId);
    if (!o) return { ok: false, error: 'Orden no encontrada.' };
    if (o.estado === 'Finalizada') return { ok: false, error: 'La orden ya fue finalizada.' };
    if (o.estado === 'Cancelada') return { ok: false, error: 'No se puede finalizar una orden cancelada.' };
    if (!texto(ejecucion.trabajo)) return { ok: false, error: 'Describa el trabajo realizado antes de finalizar el servicio.' };
    if (ejecucion.horaInicio && ejecucion.horaFin && ejecucion.horaFin < ejecucion.horaInicio) return { ok: false, error: 'La hora de finalización no puede ser anterior a la hora de inicio.' };
    const repuestos = agruparRepuestos(ejecucion.repuestos);
    if (validarRepuestos(db, repuestos).length) return { ok: false, error: 'No es posible finalizar: existencia insuficiente para uno o más repuestos.' };
    repuestos.forEach(r => { byId(db.productos, r.productoId).existencia -= r.cantidad; });
    o.ejecucion = Object.assign({}, o.ejecucion, ejecucion, { repuestos: repuestos, horaFin: ejecucion.horaFin || horaActual() });
    o.estado = 'Finalizada';
    const eq = o.equipoId ? byId(db.equipos, o.equipoId) : null;
    if (eq) {
      eq.ultMant = o.fecha;
      if (eq.estado === 'En mantenimiento' || eq.estado === 'Fuera de servicio') eq.estado = 'Activo';
      const tec = byId(db.tecnicos, o.tecnicoId);
      db.mantenimientos.push({ equipoId: eq.id, fecha: o.fecha, tipo: /correctivo|reparaci/i.test(o.tipoServicio) ? 'Correctivo' : 'Preventivo', tecnico: tec ? tec.nombre : '', descripcion: texto(ejecucion.trabajo) });
    }
    registrarBitacora(db, usuario, 'Finalizó servicio', ordenId + ' marcada como Finalizada, inventario actualizado');
    return { ok: true, orden: o };
  }

  /* ---------------------------- Rentabilidad ---------------------------- */
  /** Costo interno estimado: mano de obra 55%, transporte 70% y materiales 60% del precio de venta; repuestos a costo real. */
  function costoOrden(db, o) {
    const cot = o.cotizacionId ? byId(db.cotizaciones, o.cotizacionId) : null;
    let manoObra = 0, transporte = 0, otros = 0;
    if (cot) {
      cot.items.forEach(it => {
        if (it.tipo === 'Mano de obra') manoObra += it.cant * it.pu * 0.55;
        if (it.tipo === 'Transporte') transporte += it.cant * it.pu * 0.7;
        if (it.tipo === 'Material' || it.tipo === 'Materiales') otros += it.cant * it.pu * 0.6;
      });
    } else { manoObra = TARIFA_SIN_COTIZACION.manoObra * 0.55; transporte = TARIFA_SIN_COTIZACION.visita * 0.7; }
    const repuestos = (o.ejecucion.repuestos || []).reduce((s, r) => { const p = byId(db.productos, r.productoId); return s + (p ? p.costo * r.cantidad : 0); }, 0);
    return { manoObra: redondear(manoObra), repuestos: redondear(repuestos), transporte: redondear(transporte), otros: redondear(otros), total: redondear(manoObra + repuestos + transporte + otros) };
  }
  /** Ingreso del servicio SIN IVA (el impuesto se traslada a SAT, no es ingreso de la empresa). */
  function ingresoOrden(db, o) {
    const fac = db.facturas.find(f => f.ordenId === o.id && f.estado !== 'Anulada');
    if (fac) return fac.subtotal;
    if (o.cotizacionId) { const cot = byId(db.cotizaciones, o.cotizacionId); if (cot) return calcTotales(cot.items, cot.descuentoPct, cot.impuestoPct).base; }
    return 0;
  }
  /** Rentabilidad = Ingreso − Costo total; Margen = Utilidad / Ingreso. */
  function calcRentabilidad(ingreso, costoTotal) {
    const utilidad = redondear(ingreso - costoTotal);
    return { utilidad: utilidad, margen: ingreso > 0 ? Math.round(utilidad / ingreso * 1000) / 10 : 0 };
  }
  function rentabilidadOrden(db, o) {
    const ingreso = ingresoOrden(db, o);
    const costos = costoOrden(db, o);
    const r = calcRentabilidad(ingreso, costos.total);
    return { ingreso: ingreso, costos: costos, utilidad: r.utilidad, margen: r.margen };
  }

  /* ---------------------------- Facturación y pagos ---------------------------- */
  function pagosDeFactura(db, facId) { return db.pagos.filter(p => p.facturaId === facId); }
  function totalPagadoFactura(db, fac) { return redondear(pagosDeFactura(db, fac.id).reduce((s, p) => s + p.monto, 0)); }
  function saldoFactura(db, fac) {
    if (fac.estado === 'Anulada') return 0;
    return Math.max(0, redondear(fac.total - totalPagadoFactura(db, fac)));
  }
  /** Genera una factura (simulada) desde una orden finalizada. */
  function generarFacturaDesdeOrden(db, ordenId, usuario, hoy) {
    const o = byId(db.ordenes, ordenId);
    if (!o) return { ok: false, error: 'Orden no encontrada.' };
    if (o.estado !== 'Finalizada') return { ok: false, error: 'Solo se puede facturar una orden Finalizada.' };
    if (db.facturas.some(f => f.ordenId === ordenId && f.estado !== 'Anulada')) return { ok: false, error: 'Ya existe una factura para esta orden.' };
    const cot = o.cotizacionId ? byId(db.cotizaciones, o.cotizacionId) : null;
    let subtotal, impuesto, total;
    if (cot) { const t = calcTotales(cot.items, cot.descuentoPct, cot.impuestoPct); subtotal = t.base; impuesto = t.impuesto; total = t.total; }
    else {
      // Orden sin cotización: tarifa estándar de mano de obra + visita + repuestos usados a precio de venta.
      const repuestos = (o.ejecucion.repuestos || []).reduce((s, r) => { const p = byId(db.productos, r.productoId); return s + (p ? p.precio * r.cantidad : 0); }, 0);
      subtotal = redondear(TARIFA_SIN_COTIZACION.manoObra + TARIFA_SIN_COTIZACION.visita + repuestos);
      impuesto = redondear(subtotal * TARIFA_SIN_COTIZACION.ivaPct / 100); total = redondear(subtotal + impuesto);
    }
    let max = 100; db.facturas.forEach(f => { const m = f.id.match(/(\d+)$/); if (m) max = Math.max(max, +m[1]); });
    const fac = { id: 'FAC-2026-' + (max + 1), clienteId: o.clienteId, ordenId: o.id, fecha: hoy || todayStr(), subtotal: subtotal, impuesto: impuesto, total: total, estado: 'Pendiente' };
    db.facturas.push(fac);
    registrarBitacora(db, usuario, 'Generó factura', fac.id + ' generada desde ' + o.id);
    return { ok: true, factura: fac };
  }
  function cambiarEstadoFactura(db, id, nuevoEstado, usuario) {
    const f = byId(db.facturas, id);
    if (!f) return { ok: false, error: 'Factura no encontrada.' };
    if (!ESTADOS_FAC.includes(nuevoEstado)) return { ok: false, error: 'Estado de factura no válido.' };
    if (f.estado === 'Anulada') return { ok: false, error: 'Una factura anulada no puede cambiar de estado.' };
    const pagado = totalPagadoFactura(db, f);
    if (nuevoEstado === 'Pagada' && saldoFactura(db, f) > 0.009) return { ok: false, error: 'No se puede marcar como Pagada: la factura tiene saldo pendiente. Registre el pago.' };
    if (nuevoEstado === 'Pendiente' && pagado > 0) return { ok: false, error: 'La factura ya tiene pagos aplicados; no puede volver a Pendiente.' };
    if (nuevoEstado === 'Parcial' && !(pagado > 0 && saldoFactura(db, f) > 0.009)) return { ok: false, error: 'El estado Parcial solo aplica cuando hay pagos y saldo pendiente.' };
    const anterior = f.estado;
    f.estado = nuevoEstado;
    registrarBitacora(db, usuario, 'Cambió estado de factura', id + ': ' + anterior + ' → ' + nuevoEstado);
    return { ok: true, factura: f };
  }
  /** Registra un pago total o parcial y actualiza el estado de la factura. */
  function registrarPago(db, facturaId, monto, metodo, fecha, usuario) {
    const fac = byId(db.facturas, facturaId);
    if (!fac) return { ok: false, error: 'Factura no encontrada.' };
    if (fac.estado === 'Anulada') return { ok: false, error: 'No se pueden registrar pagos en una factura anulada.' };
    monto = redondear(monto);
    const saldo = saldoFactura(db, fac);
    if (!(monto > 0)) return { ok: false, error: 'Ingrese un monto válido mayor que 0.' };
    if (saldo <= 0) return { ok: false, error: 'La factura no tiene saldo pendiente.' };
    if (monto > saldo + 0.009) return { ok: false, error: 'El monto excede el saldo pendiente de Q ' + saldo.toFixed(2) + '.' };
    if (!METODOS_PAGO.includes(metodo)) return { ok: false, error: 'Seleccione un método de pago válido.' };
    if (fecha && !esFechaValida(fecha)) return { ok: false, error: 'Ingrese una fecha de pago válida.' };
    const pago = { id: siguienteId('PAG-', db.pagos, 3), facturaId: facturaId, clienteId: fac.clienteId, fecha: fecha || todayStr(), metodo: metodo, monto: monto };
    db.pagos.push(pago);
    fac.estado = saldoFactura(db, fac) <= 0.009 ? 'Pagada' : 'Parcial';
    registrarBitacora(db, usuario, 'Registró pago', pago.id + ' por Q ' + monto.toFixed(2) + ' aplicado a ' + facturaId);
    return { ok: true, pago: pago, factura: fac, saldo: saldoFactura(db, fac) };
  }

  /* ---------------------------- Inventario y gastos ---------------------------- */
  function stockBajo(p) { return p.existencia <= p.stockMin; }
  function validarProducto(data) {
    const e = [];
    if (!texto(data.nombre)) e.push('El nombre del producto es obligatorio.');
    ['existencia', 'stockMin', 'costo', 'precio'].forEach(k => { if (Number(data[k]) < 0 || isNaN(Number(data[k]))) e.push('Los valores numéricos no pueden ser negativos.'); });
    if (Number(data.precio) < Number(data.costo)) e.push('El precio de venta no puede ser menor que el costo.');
    return e.filter((x, i, a) => a.indexOf(x) === i);
  }
  function guardarProducto(db, id, data) {
    const errores = validarProducto(data);
    if (errores.length) return { ok: false, errores: errores, error: errores[0] };
    const norm = { nombre: texto(data.nombre), categoria: data.categoria, proveedor: texto(data.proveedor), existencia: Number(data.existencia) || 0,
      stockMin: Number(data.stockMin) || 0, costo: Number(data.costo) || 0, precio: Number(data.precio) || 0 };
    if (id) { const p = byId(db.productos, id); if (!p) return { ok: false, error: 'Producto no encontrado.' }; Object.assign(p, norm); return { ok: true, producto: p }; }
    const p = Object.assign({ id: siguienteId('INV-', db.productos, 3) }, norm);
    db.productos.push(p);
    return { ok: true, producto: p };
  }
  function totalGasto(g) { return redondear(g.monto * (1 + (g.impuestoPct || 0) / 100)); }
  function registrarGasto(db, data, usuario) {
    const monto = Number(data.monto);
    if (!(monto > 0)) return { ok: false, error: 'Ingrese un monto válido mayor que 0.' };
    if (!CATS_GASTO.includes(data.categoria)) return { ok: false, error: 'Seleccione una categoría válida.' };
    if (!esFechaValida(data.fecha)) return { ok: false, error: 'Ingrese una fecha válida.' };
    const imp = Number(data.impuestoPct) || 0;
    if (imp < 0 || imp > 100) return { ok: false, error: 'El impuesto debe estar entre 0 y 100%.' };
    const g = { id: siguienteId('GAS-', db.gastos, 3), fecha: data.fecha, categoria: data.categoria, descripcion: texto(data.descripcion) || 'Gasto operativo',
      proveedor: texto(data.proveedor), monto: redondear(monto), impuestoPct: imp };
    db.gastos.push(g);
    registrarBitacora(db, usuario, 'Registró gasto', g.id);
    return { ok: true, gasto: g };
  }

  /* ---------------------------- Usuarios ---------------------------- */
  function guardarUsuario(db, id, data, usuario) {
    const nombre = texto(data.nombre), email = texto(data.email).toLowerCase();
    if (!nombre || !email) return { ok: false, error: 'Nombre y correo son obligatorios.' };
    if (!esCorreoValido(email)) return { ok: false, error: 'El correo electrónico no tiene un formato válido.' };
    if (db.usuarios.some(u => u.id !== id && u.email.toLowerCase() === email)) return { ok: false, error: 'Ya existe un usuario con ese correo.' };
    if (!ROLES.includes(data.rol)) return { ok: false, error: 'Seleccione un rol válido.' };
    if (!data.pass || String(data.pass).length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    if (id && usuario && usuario.id === id && (data.estado !== 'Activo' || data.rol !== 'Administrador') && usuario.rol === 'Administrador')
      return { ok: false, error: 'No puede desactivar ni quitarse el rol de Administrador a sí mismo.' };
    const norm = { nombre: nombre, email: email, rol: data.rol, estado: data.estado === 'Inactivo' ? 'Inactivo' : 'Activo', pass: String(data.pass) };
    let u;
    if (id) { u = byId(db.usuarios, id); if (!u) return { ok: false, error: 'Usuario no encontrado.' }; Object.assign(u, norm); }
    else { u = Object.assign({ id: siguienteId('USR-', db.usuarios, 2), ultimoAcceso: null, tecnicoId: null }, norm); db.usuarios.push(u); }
    // Todo usuario con rol Técnico debe estar vinculado a un técnico de campo para tener agenda y órdenes.
    if (u.rol === 'Técnico' && !byId(db.tecnicos, u.tecnicoId)) {
      const tec = { id: siguienteId('TEC-', db.tecnicos, 2), nombre: u.nombre, especialidad: 'Mantenimiento general', telefono: '', estado: 'Disponible', foto: '' };
      db.tecnicos.push(tec);
      u.tecnicoId = tec.id;
    }
    if (id) { registrarBitacora(db, usuario, 'Actualizó usuario', id); return { ok: true, usuario: u }; }
    registrarBitacora(db, usuario, 'Creó usuario', u.id + ' - ' + u.rol);
    return { ok: true, usuario: u };
  }

  return {
    // catálogos
    ROLES, TIPOS_EQUIPO, TARIFA_SIN_COTIZACION, ESTADOS_EQUIPO, ESTADOS_COT, ESTADOS_ORD, ESTADOS_ORD_ACTIVOS, ESTADOS_FAC, PRIORIDADES, METODOS_PAGO, CATS_GASTO, TIPOS_LINEA, PERMISOS,
    // utilidades
    ymd, todayStr, ahoraStr, horaActual, addDays, diasEntre, esFechaValida, esHoraValida, enUltimos30, ultimosMeses, redondear, esc, byId, esCorreoValido, esTelefonoValido, siguienteId, registrarBitacora,
    // seguridad
    autenticar, vistasPermitidas, puedeAcceder, vistaInicio,
    // clientes y equipos
    validarCliente, crearCliente, actualizarCliente, validarEquipo, crearEquipo, actualizarEquipo,
    // cotizaciones
    calcTotales, validarCotizacion, crearCotizacion, actualizarCotizacion, cambiarEstadoCotizacion, fechaVencimientoCotizacion,
    // órdenes
    ejecucionVacia, checkScheduleConflict, validarOrden, crearOrden, actualizarOrden, crearOrdenDesdeCotizacion, validarRepuestos, agruparRepuestos, finalizarOrden,
    // rentabilidad
    costoOrden, ingresoOrden, calcRentabilidad, rentabilidadOrden,
    // facturación
    pagosDeFactura, totalPagadoFactura, saldoFactura, generarFacturaDesdeOrden, cambiarEstadoFactura, registrarPago,
    // inventario, gastos, usuarios
    stockBajo, validarProducto, guardarProducto, totalGasto, registrarGasto, guardarUsuario,
  };
});
