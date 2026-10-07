/**
 * Pruebas unitarias — Órdenes de trabajo, agenda de técnicos y panel técnico
 */
const { L, HOY, nuevaDB, admin, tecnicoUsr } = require('../helpers/contexto');

const ordenValida = (extra) => Object.assign({
  clienteId: 'CLI-003', equipoId: 'EQ-005', tecnicoId: 'TEC-04', tipoServicio: 'Mantenimiento correctivo',
  fecha: '2026-09-30', hora: '09:00', prioridad: 'Media', estado: 'Programada', descripcion: 'Ruido en rodamientos',
}, extra);

describe('Validación de conflicto de agenda (checkScheduleConflict)', () => {
  test('CP-UNI-19 Detecta choque: mismo técnico, misma fecha y hora', () => {
    const db = nuevaDB();
    const c = L.checkScheduleConflict(db, 'TEC-01', '2026-08-22', '08:00');
    expect(c).toBeDefined();
    expect(c.id).toBe('OT-2026-001');
  });

  test('CP-UNI-20 Sin choque si cambia la hora', () => {
    expect(L.checkScheduleConflict(nuevaDB(), 'TEC-01', '2026-08-22', '09:00')).toBeUndefined();
  });

  test('CP-UNI-21 Sin choque si es otro técnico en el mismo horario', () => {
    expect(L.checkScheduleConflict(nuevaDB(), 'TEC-02', '2026-08-22', '08:00')).toBeUndefined();
  });

  test('CP-UNI-22 Ignora órdenes canceladas', () => {
    // OT-2026-010 (TEC-02, 2026-08-30 08:00) está Cancelada
    expect(L.checkScheduleConflict(nuevaDB(), 'TEC-02', '2026-08-30', '08:00')).toBeUndefined();
  });

  test('CP-UNI-23 Al editar, la orden no choca consigo misma', () => {
    expect(L.checkScheduleConflict(nuevaDB(), 'TEC-01', '2026-08-22', '08:00', 'OT-2026-001')).toBeUndefined();
  });
});

describe('Registro y edición de órdenes', () => {
  test('CP-UNI-24 Crea una orden válida con ejecución vacía', () => {
    const db = nuevaDB();
    const r = L.crearOrden(db, ordenValida(), admin(db));
    expect(r.ok).toBe(true);
    expect(r.orden.id).toBe('OT-2026-014');
    expect(r.orden.ejecucion.repuestos).toEqual([]);
  });

  test('CP-UNI-25 Bloquea el guardado cuando hay conflicto de horario', () => {
    const db = nuevaDB();
    const r = L.crearOrden(db, ordenValida({ tecnicoId: 'TEC-01', fecha: HOY, hora: '11:00' }), admin(db));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Conflicto de agenda.*OT-2026-013/);
  });

  test('CP-UNI-26 Exige descripción del problema', () => {
    const db = nuevaDB();
    expect(L.crearOrden(db, ordenValida({ descripcion: '   ' }), admin(db)).ok).toBe(false);
  });

  test.each([['25:00'], ['8am'], ['']])('CP-UNI-27 Rechaza hora inválida "%s"', (hora) => {
    const db = nuevaDB();
    expect(L.crearOrden(db, ordenValida({ hora }), admin(db)).ok).toBe(false);
  });

  test('CP-UNI-28 No permite marcar una orden como Finalizada desde el formulario', () => {
    const db = nuevaDB();
    const r = L.actualizarOrden(db, 'OT-2026-006', ordenValida({ estado: 'Finalizada' }), admin(db));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/panel técnico/);
  });

  test('CP-UNI-29 Rechaza un equipo de otro cliente', () => {
    const db = nuevaDB();
    expect(L.crearOrden(db, ordenValida({ equipoId: 'EQ-001' }), admin(db)).ok).toBe(false);
  });
});

describe('Generación de orden desde cotización', () => {
  test('CP-UNI-30 Solo genera la orden si la cotización está Aprobada', () => {
    const db = nuevaDB();
    const r = L.crearOrdenDesdeCotizacion(db, 'COT-2026-003', admin(db), HOY); // Enviada
    expect(r.ok).toBe(false);
  });

  test('CP-UNI-31 Genera la orden con los datos de la cotización aprobada', () => {
    const db = nuevaDB();
    L.cambiarEstadoCotizacion(db, 'COT-2026-003', 'Aprobada', admin(db));
    const r = L.crearOrdenDesdeCotizacion(db, 'COT-2026-003', admin(db), HOY);
    expect(r.ok).toBe(true);
    expect(r.orden).toMatchObject({ cotizacionId: 'COT-2026-003', clienteId: 'CLI-003', equipoId: 'EQ-005', tecnicoId: 'TEC-04', estado: 'Pendiente' });
  });

  test('CP-UNI-32 No genera una segunda orden para la misma cotización', () => {
    const db = nuevaDB();
    const r = L.crearOrdenDesdeCotizacion(db, 'COT-2026-001', admin(db), HOY);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Ya existe/);
  });

  test('CP-UNI-33 La orden generada se programa en un horario libre del técnico', () => {
    const db = nuevaDB();
    L.cambiarEstadoCotizacion(db, 'COT-2026-003', 'Aprobada', admin(db));
    // Se ocupa el horario por defecto (hoy + 2 días, 08:00) del técnico TEC-04
    L.crearOrden(db, ordenValida({ fecha: '2026-09-21', hora: '08:00' }), admin(db));
    const r = L.crearOrdenDesdeCotizacion(db, 'COT-2026-003', admin(db), HOY);
    expect(r.ok).toBe(true);
    expect(L.checkScheduleConflict(db, 'TEC-04', r.orden.fecha, r.orden.hora, r.orden.id)).toBeUndefined();
  });
});

describe('Finalización de servicio (panel técnico)', () => {
  const ejec = (extra) => Object.assign({ horaInicio: '08:00', horaFin: '10:00', diagnostico: 'Rodamiento dañado', trabajo: 'Cambio de rodamiento', repuestos: [{ productoId: 'INV-001', cantidad: 2 }] }, extra);

  test('CP-UNI-34 Descuenta automáticamente el inventario utilizado', () => {
    const db = nuevaDB();
    const antes = L.byId(db.productos, 'INV-001').existencia;
    const r = L.finalizarOrden(db, 'OT-2026-013', ejec(), tecnicoUsr(db));
    expect(r.ok).toBe(true);
    expect(L.byId(db.productos, 'INV-001').existencia).toBe(antes - 2);
    expect(r.orden.estado).toBe('Finalizada');
  });

  test('CP-UNI-35 No finaliza si la existencia es insuficiente y no modifica el inventario', () => {
    const db = nuevaDB();
    const r = L.finalizarOrden(db, 'OT-2026-013', ejec({ repuestos: [{ productoId: 'INV-018', cantidad: 5 }] }), tecnicoUsr(db));
    expect(r.ok).toBe(false);
    expect(L.byId(db.productos, 'INV-018').existencia).toBe(1);
    expect(L.byId(db.ordenes, 'OT-2026-013').estado).toBe('Programada');
  });

  test('CP-UNI-36 Suma líneas repetidas del mismo repuesto antes de validar existencia', () => {
    const db = nuevaDB(); // INV-014 tiene 2 unidades
    const r = L.finalizarOrden(db, 'OT-2026-013', ejec({ repuestos: [{ productoId: 'INV-014', cantidad: 2 }, { productoId: 'INV-014', cantidad: 1 }] }), tecnicoUsr(db));
    expect(r.ok).toBe(false);
    expect(L.byId(db.productos, 'INV-014').existencia).toBe(2);
  });

  test('CP-UNI-37 Exige describir el trabajo realizado', () => {
    const db = nuevaDB();
    expect(L.finalizarOrden(db, 'OT-2026-013', ejec({ trabajo: '' }), tecnicoUsr(db)).ok).toBe(false);
  });

  test('CP-UNI-38 Rechaza hora de fin anterior a la de inicio', () => {
    const db = nuevaDB();
    expect(L.finalizarOrden(db, 'OT-2026-013', ejec({ horaInicio: '10:00', horaFin: '09:00' }), tecnicoUsr(db)).ok).toBe(false);
  });

  test('CP-UNI-39 No permite finalizar dos veces la misma orden', () => {
    const db = nuevaDB();
    expect(L.finalizarOrden(db, 'OT-2026-001', ejec(), tecnicoUsr(db)).ok).toBe(false);
  });

  test('CP-UNI-40 No permite finalizar una orden cancelada', () => {
    const db = nuevaDB();
    expect(L.finalizarOrden(db, 'OT-2026-010', ejec(), tecnicoUsr(db)).ok).toBe(false);
  });

  test('CP-UNI-41 Actualiza el último mantenimiento e historial del equipo', () => {
    const db = nuevaDB();
    const hist = db.mantenimientos.filter(m => m.equipoId === 'EQ-009').length;
    L.finalizarOrden(db, 'OT-2026-013', ejec(), tecnicoUsr(db));
    expect(L.byId(db.equipos, 'EQ-009').ultMant).toBe(HOY);
    expect(db.mantenimientos.filter(m => m.equipoId === 'EQ-009').length).toBe(hist + 1);
  });
});
