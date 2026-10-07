/**
 * Pruebas unitarias — Facturación, pagos y cuentas por cobrar
 */
const { L, HOY, nuevaDB, admin, tecnicoUsr } = require('../helpers/contexto');

describe('Saldo de facturas', () => {
  test('CP-UNI-42 Calcula el saldo restando los pagos aplicados', () => {
    const db = nuevaDB(); // FAC-2026-102: total 19,453.15 con pago de 12,000
    expect(L.saldoFactura(db, L.byId(db.facturas, 'FAC-2026-102'))).toBe(7453.15);
  });

  test('CP-UNI-43 Una factura anulada no genera saldo por cobrar', () => {
    const db = nuevaDB();
    expect(L.saldoFactura(db, L.byId(db.facturas, 'FAC-2026-106'))).toBe(0);
  });

  test('CP-UNI-44 Una factura pagada tiene saldo 0', () => {
    const db = nuevaDB();
    expect(L.saldoFactura(db, L.byId(db.facturas, 'FAC-2026-101'))).toBe(0);
  });
});

describe('Generación de facturas', () => {
  function finalizar(db, id) {
    return L.finalizarOrden(db, id, { trabajo: 'Servicio ejecutado', repuestos: [] }, tecnicoUsr(db));
  }

  test('CP-UNI-45 Solo se factura una orden Finalizada', () => {
    const db = nuevaDB();
    const r = L.generarFacturaDesdeOrden(db, 'OT-2026-005', admin(db), HOY); // Programada
    expect(r.ok).toBe(false);
  });

  test('CP-UNI-46 La factura toma subtotal, IVA y total de la cotización origen', () => {
    const db = nuevaDB();
    finalizar(db, 'OT-2026-004'); // generada desde COT-2026-009 (10% de descuento)
    const cot = L.byId(db.cotizaciones, 'COT-2026-009');
    const t = L.calcTotales(cot.items, cot.descuentoPct, cot.impuestoPct);
    const r = L.generarFacturaDesdeOrden(db, 'OT-2026-004', admin(db), HOY);
    expect(r.ok).toBe(true);
    expect(r.factura).toMatchObject({ subtotal: t.base, impuesto: t.impuesto, total: t.total, estado: 'Pendiente', fecha: HOY, clienteId: 'CLI-010' });
    expect(r.factura.id).toBe('FAC-2026-107');
  });

  test('CP-UNI-47 No permite facturar dos veces la misma orden', () => {
    const db = nuevaDB();
    const r = L.generarFacturaDesdeOrden(db, 'OT-2026-001', admin(db), HOY);
    expect(r.ok).toBe(false);
  });
});

describe('Registro de pagos', () => {
  test('CP-UNI-48 Pago parcial deja la factura en estado Parcial con saldo correcto', () => {
    const db = nuevaDB(); // FAC-2026-105: total 1,400 y pago previo de 600 → saldo 800
    const r = L.registrarPago(db, 'FAC-2026-105', 300, 'Efectivo', HOY, admin(db));
    expect(r.ok).toBe(true);
    expect(r.factura.estado).toBe('Parcial');
    expect(r.saldo).toBe(500);
  });

  test('CP-UNI-49 Pago por el saldo exacto deja la factura Pagada (valor límite)', () => {
    const db = nuevaDB();
    const r = L.registrarPago(db, 'FAC-2026-105', 800, 'Transferencia', HOY, admin(db));
    expect(r.ok).toBe(true);
    expect(r.factura.estado).toBe('Pagada');
    expect(r.saldo).toBe(0);
  });

  test('CP-UNI-50 Rechaza un pago mayor al saldo pendiente', () => {
    const db = nuevaDB();
    const r = L.registrarPago(db, 'FAC-2026-105', 800.01, 'Efectivo', HOY, admin(db));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/excede el saldo/);
  });

  test.each([[0], [-50], [NaN]])('CP-UNI-51 Rechaza montos no válidos (%s)', (monto) => {
    const db = nuevaDB();
    expect(L.registrarPago(db, 'FAC-2026-105', monto, 'Efectivo', HOY, admin(db)).ok).toBe(false);
  });

  test('CP-UNI-52 No registra pagos en facturas anuladas ni en facturas ya pagadas', () => {
    const db = nuevaDB();
    expect(L.registrarPago(db, 'FAC-2026-106', 100, 'Efectivo', HOY, admin(db)).ok).toBe(false);
    expect(L.registrarPago(db, 'FAC-2026-101', 100, 'Efectivo', HOY, admin(db)).ok).toBe(false);
  });

  test('CP-UNI-53 Rechaza un método de pago no permitido', () => {
    const db = nuevaDB();
    expect(L.registrarPago(db, 'FAC-2026-105', 100, 'Bitcoin', HOY, admin(db)).ok).toBe(false);
  });
});

describe('Cambio manual de estado de facturas', () => {
  test('CP-UNI-54 No permite marcar como Pagada una factura con saldo pendiente', () => {
    const db = nuevaDB();
    const r = L.cambiarEstadoFactura(db, 'FAC-2026-102', 'Pagada', admin(db));
    expect(r.ok).toBe(false);
  });

  test('CP-UNI-55 Permite anular una factura y una anulada ya no cambia de estado', () => {
    const db = nuevaDB();
    expect(L.cambiarEstadoFactura(db, 'FAC-2026-105', 'Anulada', admin(db)).ok).toBe(true);
    expect(L.cambiarEstadoFactura(db, 'FAC-2026-105', 'Pendiente', admin(db)).ok).toBe(false);
  });

  test('CP-UNI-56 Una factura Vencida conserva su saldo por cobrar', () => {
    const db = nuevaDB();
    const f = L.byId(db.facturas, 'FAC-2026-104');
    expect(f.estado).toBe('Vencida');
    expect(L.saldoFactura(db, f)).toBe(1414.4);
  });
});
