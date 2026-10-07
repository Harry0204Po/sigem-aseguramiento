/**
 * Pruebas unitarias — Módulo de cotizaciones
 * Técnica: caja negra (partición de equivalencia y valores límite).
 */
const { L, HOY, nuevaDB, admin, cotizacionValida } = require('../helpers/contexto');

describe('Cálculo de totales de cotización (calcTotales)', () => {
  test('CP-UNI-01 Ejemplo del requerimiento: MO Q1,000 + Repuestos Q1,500 + Transporte Q300 con IVA 12%', () => {
    const items = [{ cant: 1, pu: 1000 }, { cant: 1, pu: 1500 }, { cant: 1, pu: 300 }];
    const t = L.calcTotales(items, 0, 12);
    expect(t.subtotal).toBe(2800);
    expect(t.descuento).toBe(0);
    expect(t.impuesto).toBe(336);
    expect(t.total).toBe(3136);
  });

  test('CP-UNI-02 Aplica el descuento antes del impuesto', () => {
    const t = L.calcTotales([{ cant: 1, pu: 2800 }], 10, 12);
    expect(t.descuento).toBe(280);
    expect(t.base).toBe(2520);
    expect(t.impuesto).toBe(302.4);
    expect(t.total).toBe(2822.4);
  });

  test('CP-UNI-03 Multiplica cantidad por precio unitario en cada línea', () => {
    const t = L.calcTotales([{ cant: 4, pu: 150 }, { cant: 2, pu: 98 }], 0, 0);
    expect(t.subtotal).toBe(796);
    expect(t.total).toBe(796);
  });

  test('CP-UNI-04 Sin líneas el total es 0 (valor límite)', () => {
    expect(L.calcTotales([], 0, 12).total).toBe(0);
  });

  test('CP-UNI-05 Redondea a 2 decimales (centavos)', () => {
    const t = L.calcTotales([{ cant: 3, pu: 33.333 }], 0, 12);
    expect(t.subtotal).toBe(100);
    expect(Number.isInteger(t.total * 100)).toBe(true);
  });

  test('CP-UNI-06 Descuento del 100% deja el total en 0 (valor límite)', () => {
    expect(L.calcTotales([{ cant: 1, pu: 500 }], 100, 12).total).toBe(0);
  });
});

describe('Validación y registro de cotizaciones', () => {
  test('CP-UNI-07 Crea una cotización válida en estado Borrador con correlativo', () => {
    const db = nuevaDB();
    const r = L.crearCotizacion(db, cotizacionValida('CLI-001', 'EQ-001'), admin(db));
    expect(r.ok).toBe(true);
    expect(r.cotizacion.estado).toBe('Borrador');
    expect(r.cotizacion.id).toBe('COT-2026-011');
  });

  test('CP-UNI-08 Rechaza una cotización sin líneas de detalle', () => {
    const db = nuevaDB();
    const data = Object.assign(cotizacionValida('CLI-001', 'EQ-001'), { items: [{ desc: '', cant: 1, pu: 10 }] });
    const r = L.crearCotizacion(db, data, admin(db));
    expect(r.ok).toBe(false);
    expect(r.errores).toContain('Agregue al menos una línea de detalle.');
  });

  test('CP-UNI-09 Rechaza cantidades en 0 o negativas', () => {
    const db = nuevaDB();
    const data = cotizacionValida('CLI-001', 'EQ-001');
    data.items[0].cant = 0;
    expect(L.crearCotizacion(db, data, admin(db)).ok).toBe(false);
    data.items[0].cant = -2;
    expect(L.crearCotizacion(db, data, admin(db)).ok).toBe(false);
  });

  test('CP-UNI-10 Rechaza precio unitario negativo', () => {
    const db = nuevaDB();
    const data = cotizacionValida('CLI-001', 'EQ-001');
    data.items[1].pu = -1;
    expect(L.crearCotizacion(db, data, admin(db)).error).toMatch(/precio unitario/);
  });

  test.each([[-1], [101]])('CP-UNI-11 Rechaza descuento fuera de 0–100%% (%s)', (desc) => {
    const db = nuevaDB();
    const data = Object.assign(cotizacionValida('CLI-001', 'EQ-001'), { descuentoPct: desc });
    expect(L.crearCotizacion(db, data, admin(db)).ok).toBe(false);
  });

  test('CP-UNI-12 Rechaza un equipo que no pertenece al cliente', () => {
    const db = nuevaDB();
    const r = L.crearCotizacion(db, cotizacionValida('CLI-001', 'EQ-003'), admin(db));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/no pertenece/);
  });

  test('CP-UNI-13 Rechaza cliente sin equipos registrados', () => {
    const db = nuevaDB();
    const r = L.crearCotizacion(db, cotizacionValida('CLI-009', ''), admin(db));
    expect(r.ok).toBe(false);
  });

  test('CP-UNI-14 Calcula la fecha de vencimiento según la vigencia', () => {
    expect(L.fechaVencimientoCotizacion({ fecha: HOY, vigenciaDias: 15 })).toBe('2026-10-04');
  });
});

describe('Cambio de estado de cotizaciones', () => {
  test('CP-UNI-15 Cambia de Enviada a Aprobada y registra en bitácora', () => {
    const db = nuevaDB();
    const antes = db.bitacora.length;
    const r = L.cambiarEstadoCotizacion(db, 'COT-2026-003', 'Aprobada', admin(db));
    expect(r.ok).toBe(true);
    expect(r.anterior).toBe('Enviada');
    expect(db.bitacora.length).toBe(antes + 1);
  });

  test('CP-UNI-16 Rechaza un estado que no existe', () => {
    const db = nuevaDB();
    expect(L.cambiarEstadoCotizacion(db, 'COT-2026-003', 'Facturada', admin(db)).ok).toBe(false);
  });

  test('CP-UNI-17 No permite rechazar una cotización que ya generó orden de trabajo', () => {
    const db = nuevaDB();
    const r = L.cambiarEstadoCotizacion(db, 'COT-2026-001', 'Rechazada', admin(db));
    expect(r.ok).toBe(false);
  });

  test('CP-UNI-18 No permite editar una cotización que ya generó orden de trabajo', () => {
    const db = nuevaDB();
    const r = L.actualizarCotizacion(db, 'COT-2026-001', cotizacionValida('CLI-001', 'EQ-001'), admin(db));
    expect(r.ok).toBe(false);
  });
});
