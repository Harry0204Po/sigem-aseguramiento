/**
 * Pruebas unitarias — Utilidades de fecha y datos de demostración
 */
const { L, D, HOY, nuevaDB } = require('../helpers/contexto');

describe('Utilidades de fecha', () => {
  test('CP-UNI-78 Suma días cruzando cambio de mes y de año', () => {
    expect(L.addDays('2026-09-30', 1)).toBe('2026-10-01');
    expect(L.addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(L.addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  test('CP-UNI-79 Valida formato de fecha y hora', () => {
    expect(L.esFechaValida('2026-09-19')).toBe(true);
    expect(L.esFechaValida('19/09/2026')).toBe(false);
    expect(L.esHoraValida('23:59')).toBe(true);
    expect(L.esHoraValida('24:00')).toBe(false);
  });

  test('CP-UNI-80 Rango de últimos 30 días incluye los extremos (valores límite)', () => {
    expect(L.enUltimos30('2026-08-20', HOY)).toBe(true);
    expect(L.enUltimos30('2026-08-19', HOY)).toBe(false);
    expect(L.enUltimos30(HOY, HOY)).toBe(true);
    expect(L.enUltimos30('2026-09-20', HOY)).toBe(false);
  });

  test('CP-UNI-81 Genera las etiquetas de los últimos 6 meses', () => {
    expect(L.ultimosMeses(6, new Date(2026, 9, 6))).toEqual(['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct']);
    expect(L.ultimosMeses(3, new Date(2027, 0, 15))).toEqual(['Nov', 'Dic', 'Ene']);
  });
});

describe('Fecha y hora local (Guatemala, UTC-6)', () => {
  afterEach(() => jest.useRealTimers());

  test('CP-UNI-90 Después de las 18:00 "hoy" sigue siendo el día local, no el día UTC', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-07T02:30:00Z')); // 6 oct 20:30 en Guatemala
    expect(L.todayStr()).toBe('2026-10-06');
    expect(L.ahoraStr()).toBe('2026-10-06 20:30');
  });
});

describe('Datos de demostración (requerimiento 20)', () => {
  test('CP-UNI-82 Cumplen las cantidades mínimas requeridas', () => {
    const db = nuevaDB();
    expect(db.clientes.length).toBeGreaterThanOrEqual(10);
    expect(db.equipos.length).toBeGreaterThanOrEqual(15);
    expect(db.cotizaciones.length).toBeGreaterThanOrEqual(8);
    expect(db.ordenes.length).toBeGreaterThanOrEqual(10);
    expect(db.productos.length).toBeGreaterThanOrEqual(20);
    expect(db.facturas.length).toBeGreaterThanOrEqual(6);
    expect(db.pagos.length).toBeGreaterThanOrEqual(5);
  });

  test('CP-UNI-83 Incluyen los clientes y técnicos indicados en el requerimiento', () => {
    const db = nuevaDB();
    ['Residenciales del Valle, S.A.', 'Industrias San José', 'Comercializadora Eléctrica del Sur', 'Condominio Las Fuentes']
      .forEach(n => expect(db.clientes.map(c => c.nombre)).toContain(n));
    expect(db.tecnicos.map(t => t.nombre)).toEqual(['Carlos Méndez', 'José Ramírez', 'Luis Herrera', 'Pedro Morales']);
  });

  test('CP-UNI-84 Integridad referencial: toda orden, equipo y factura apunta a registros existentes', () => {
    const db = nuevaDB();
    db.equipos.forEach(e => expect(L.byId(db.clientes, e.clienteId)).toBeDefined());
    db.ordenes.forEach(o => {
      expect(L.byId(db.clientes, o.clienteId)).toBeDefined();
      expect(L.byId(db.tecnicos, o.tecnicoId)).toBeDefined();
      if (o.equipoId) expect(L.byId(db.equipos, o.equipoId)).toBeDefined();
    });
    db.pagos.forEach(p => expect(L.byId(db.facturas, p.facturaId)).toBeDefined());
  });

  test('CP-UNI-85 Cada llamada crea una base independiente (las pruebas no comparten estado)', () => {
    const a = nuevaDB(), b = nuevaDB();
    a.clientes.pop();
    expect(b.clientes).toHaveLength(10);
  });

  test('CP-UNI-86 Desplaza las fechas para que la fecha de referencia coincida con "hoy"', () => {
    const db = D.crearDatosDemo('2026-10-06'); // 17 días después de la referencia
    expect(L.byId(db.ordenes, 'OT-2026-013').fecha).toBe('2026-10-06');
    expect(L.byId(db.ordenes, 'OT-2026-001').fecha).toBe('2026-09-08');
  });
});
