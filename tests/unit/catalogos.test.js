/**
 * Pruebas unitarias — Clientes, equipos, inventario, gastos y rentabilidad
 */
const { L, HOY, nuevaDB, admin, clienteValido, equipoValido } = require('../helpers/contexto');

describe('Clientes', () => {
  test('CP-UNI-57 Registra un cliente válido con código correlativo', () => {
    const db = nuevaDB();
    const r = L.crearCliente(db, clienteValido(), admin(db));
    expect(r.ok).toBe(true);
    expect(r.cliente.id).toBe('CLI-011');
    expect(r.cliente.estado).toBe('Activo');
  });

  test('CP-UNI-58 Nombre y NIT son obligatorios', () => {
    const db = nuevaDB();
    const r = L.crearCliente(db, Object.assign(clienteValido(), { nombre: '', nit: '' }), admin(db));
    expect(r.ok).toBe(false);
    expect(r.errores).toHaveLength(2);
  });

  test('CP-UNI-59 No permite NIT duplicado', () => {
    const db = nuevaDB();
    const r = L.crearCliente(db, Object.assign(clienteValido(), { nit: '5512345-6' }), admin(db));
    expect(r.error).toMatch(/NIT/);
  });

  test.each([['correo-invalido'], ['a@b'], ['sin arroba.com']])('CP-UNI-60 Rechaza correo con formato inválido "%s"', (correo) => {
    const db = nuevaDB();
    expect(L.crearCliente(db, Object.assign(clienteValido(), { correo }), admin(db)).ok).toBe(false);
  });

  test.each([['123'], ['abcd-efgh'], ['2234-11223']])('CP-UNI-61 Rechaza teléfono que no tiene 8 dígitos "%s"', (telefono) => {
    const db = nuevaDB();
    expect(L.crearCliente(db, Object.assign(clienteValido(), { telefono }), admin(db)).ok).toBe(false);
  });

  test('CP-UNI-62 Edita un cliente conservando su propio NIT', () => {
    const db = nuevaDB();
    const c = L.byId(db.clientes, 'CLI-001');
    const r = L.actualizarCliente(db, 'CLI-001', Object.assign({}, c, { telefono: '5555-0000' }), admin(db));
    expect(r.ok).toBe(true);
    expect(L.byId(db.clientes, 'CLI-001').telefono).toBe('5555-0000');
  });

  test('CP-UNI-63 Si no se indica empresa, usa el nombre', () => {
    const db = nuevaDB();
    const r = L.crearCliente(db, Object.assign(clienteValido(), { empresa: '' }), admin(db));
    expect(r.cliente.empresa).toBe(r.cliente.nombre);
  });
});

describe('Equipos', () => {
  test('CP-UNI-64 Registra un equipo asociado a un cliente', () => {
    const db = nuevaDB();
    const r = L.crearEquipo(db, equipoValido('CLI-004'), admin(db));
    expect(r.ok).toBe(true);
    expect(r.equipo.id).toBe('EQ-016');
    expect(db.equipos.filter(e => e.clienteId === 'CLI-004')).toHaveLength(3);
  });

  test('CP-UNI-65 Marca y número de serie son obligatorios', () => {
    const db = nuevaDB();
    const r = L.crearEquipo(db, Object.assign(equipoValido('CLI-004'), { marca: '', serie: '' }), admin(db));
    expect(r.errores).toHaveLength(2);
  });

  test('CP-UNI-66 No permite números de serie duplicados', () => {
    const db = nuevaDB();
    expect(L.crearEquipo(db, Object.assign(equipoValido('CLI-004'), { serie: 'fe-90123' }), admin(db)).ok).toBe(false);
  });

  test.each([[0], [-5]])('CP-UNI-67 Rechaza potencia HP no positiva (%s)', (hp) => {
    const db = nuevaDB();
    expect(L.crearEquipo(db, Object.assign(equipoValido('CLI-004'), { potenciaHP: hp }), admin(db)).ok).toBe(false);
  });

  test('CP-UNI-68 Permite paneles de control sin potencia HP', () => {
    const db = nuevaDB();
    const r = L.crearEquipo(db, Object.assign(equipoValido('CLI-004'), { tipo: 'Panel de control', potenciaHP: '' }), admin(db));
    expect(r.ok).toBe(true);
    expect(r.equipo.potenciaHP).toBeNull();
  });
});

describe('Inventario', () => {
  test('CP-UNI-69 Identifica stock bajo cuando la existencia es menor o igual al mínimo (valor límite)', () => {
    expect(L.stockBajo({ existencia: 5, stockMin: 5 })).toBe(true);
    expect(L.stockBajo({ existencia: 6, stockMin: 5 })).toBe(false);
    expect(L.stockBajo({ existencia: 4, stockMin: 5 })).toBe(true);
  });

  test('CP-UNI-70 Los datos de demostración tienen productos con stock bajo para la alerta visual', () => {
    expect(nuevaDB().productos.filter(L.stockBajo).length).toBeGreaterThan(0);
  });

  test('CP-UNI-71 No permite valores negativos ni precio de venta menor al costo', () => {
    const db = nuevaDB();
    const base = { nombre: 'Contactor', categoria: 'Contactores', proveedor: 'X', existencia: 1, stockMin: 1, costo: 100, precio: 150 };
    expect(L.guardarProducto(db, null, base).ok).toBe(true);
    expect(L.guardarProducto(db, null, Object.assign({}, base, { existencia: -1 })).ok).toBe(false);
    expect(L.guardarProducto(db, null, Object.assign({}, base, { precio: 50 })).ok).toBe(false);
  });
});

describe('Gastos', () => {
  test('CP-UNI-72 Calcula el total del gasto con impuesto', () => {
    expect(L.totalGasto({ monto: 850, impuestoPct: 12 })).toBe(952);
    expect(L.totalGasto({ monto: 980, impuestoPct: 0 })).toBe(980);
  });

  test('CP-UNI-73 Registra un gasto válido y rechaza montos no positivos o categorías inválidas', () => {
    const db = nuevaDB();
    const g = { fecha: HOY, categoria: 'Combustible', descripcion: 'Diésel', proveedor: 'Puma', monto: 300, impuestoPct: 12 };
    expect(L.registrarGasto(db, g, admin(db)).ok).toBe(true);
    expect(L.registrarGasto(db, Object.assign({}, g, { monto: 0 }), admin(db)).ok).toBe(false);
    expect(L.registrarGasto(db, Object.assign({}, g, { categoria: 'Fiestas' }), admin(db)).ok).toBe(false);
  });
});

describe('Rentabilidad', () => {
  test('CP-UNI-74 Ejemplo del requerimiento: ingreso Q5,000 y costos Q2,500 → utilidad Q2,500 y margen 50%', () => {
    const costoTotal = 800 + 1200 + 300 + 200;
    expect(L.calcRentabilidad(5000, costoTotal)).toEqual({ utilidad: 2500, margen: 50 });
  });

  test('CP-UNI-75 Detecta servicios con pérdida (utilidad y margen negativos)', () => {
    const r = L.calcRentabilidad(1000, 1500);
    expect(r.utilidad).toBe(-500);
    expect(r.margen).toBe(-50);
  });

  test('CP-UNI-76 Sin ingreso el margen es 0 (evita división entre cero)', () => {
    expect(L.calcRentabilidad(0, 300).margen).toBe(0);
  });

  test('CP-UNI-77 Los repuestos se valoran a costo de inventario en la rentabilidad de la orden', () => {
    const db = nuevaDB(); // OT-2026-001 usó 1 sello mecánico 5/8" (costo Q95)
    const r = L.rentabilidadOrden(db, L.byId(db.ordenes, 'OT-2026-001'));
    expect(r.costos.repuestos).toBe(95);
    expect(r.ingreso).toBe(775); // subtotal de FAC-2026-101, sin IVA
    expect(r.utilidad).toBeCloseTo(r.ingreso - r.costos.total, 2);
  });
});

describe('Rentabilidad · líneas de materiales', () => {
  test('CP-UNI-87 Las líneas tipo "Materiales" de cotizaciones nuevas se incluyen en los costos', () => {
    const db = nuevaDB();
    const orden = { cotizacionId: 'X', ejecucion: { repuestos: [] } };
    db.cotizaciones.push({ id: 'X', items: [{ tipo: 'Materiales', cant: 2, pu: 100 }, { tipo: 'Material', cant: 1, pu: 100 }], descuentoPct: 0, impuestoPct: 0 });
    expect(L.costoOrden(db, orden).otros).toBe(180); // 300 × 60 %
  });
});

describe('Facturación de órdenes sin cotización', () => {
  test('CP-UNI-88 Usa tarifa estándar (MO Q800 + visita Q150) más repuestos a precio de venta, con IVA 12%', () => {
    const db = nuevaDB();
    L.finalizarOrden(db, 'OT-2026-013', { trabajo: 'Cambio de breaker', repuestos: [{ productoId: 'INV-001', cantidad: 2 }] }, admin(db)); // 2 × Q65
    const r = L.generarFacturaDesdeOrden(db, 'OT-2026-013', admin(db), HOY);
    expect(r.factura).toMatchObject({ subtotal: 1080, impuesto: 129.6, total: 1209.6 });
  });
});

describe('Usuarios con rol Técnico', () => {
  test('CP-UNI-89 Un usuario Técnico nuevo queda vinculado a un técnico de campo', () => {
    const db = nuevaDB();
    const r = L.guardarUsuario(db, null, { nombre: 'Mario Cifuentes', email: 'mcifuentes@sigem.com', rol: 'Técnico', estado: 'Activo', pass: '123456' }, admin(db));
    expect(r.ok).toBe(true);
    expect(L.byId(db.tecnicos, r.usuario.tecnicoId)).toMatchObject({ nombre: 'Mario Cifuentes', estado: 'Disponible' });
  });
});
