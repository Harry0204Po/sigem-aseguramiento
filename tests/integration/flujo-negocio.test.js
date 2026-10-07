/**
 * Pruebas de integración — Flujo completo del negocio (requerimiento 19)
 * Verifican que los módulos funcionen juntos: cada paso usa el resultado del
 * anterior y el estado final de la base de datos debe ser coherente.
 */
const { L, HOY, nuevaDB, admin, usuario, tecnicoUsr, clienteValido, equipoValido, cotizacionValida } = require('../helpers/contexto');

describe('CP-INT-01 Flujo de 13 pasos: cliente → cotización → orden → servicio → factura → pago → rentabilidad', () => {
  const db = nuevaDB();
  const adm = admin(db);
  const ctx = {};

  test('1. Registrar cliente', () => {
    const r = L.crearCliente(db, clienteValido(), adm);
    expect(r.ok).toBe(true);
    ctx.cliente = r.cliente;
  });

  test('2. Registrar equipo del cliente', () => {
    const r = L.crearEquipo(db, equipoValido(ctx.cliente.id), adm);
    expect(r.ok).toBe(true);
    ctx.equipo = r.equipo;
  });

  test('3. Crear cotización (cálculo del ejemplo del requerimiento)', () => {
    const r = L.crearCotizacion(db, cotizacionValida(ctx.cliente.id, ctx.equipo.id), adm);
    expect(r.ok).toBe(true);
    ctx.cot = r.cotizacion;
    expect(L.calcTotales(ctx.cot.items, 0, 12).total).toBe(3136);
  });

  test('4. Aprobar cotización', () => {
    expect(L.cambiarEstadoCotizacion(db, ctx.cot.id, 'Enviada', adm).ok).toBe(true);
    expect(L.cambiarEstadoCotizacion(db, ctx.cot.id, 'Aprobada', adm).ok).toBe(true);
  });

  test('5. Generar orden de trabajo desde la cotización aprobada', () => {
    const r = L.crearOrdenDesdeCotizacion(db, ctx.cot.id, adm, HOY);
    expect(r.ok).toBe(true);
    ctx.orden = r.orden;
    expect(ctx.orden.cotizacionId).toBe(ctx.cot.id);
  });

  test('6. Asignar técnico y programar sin conflicto de agenda', () => {
    const o = ctx.orden;
    const data = { clienteId: o.clienteId, equipoId: o.equipoId, tecnicoId: 'TEC-01', tipoServicio: o.tipoServicio, fecha: HOY, hora: '15:00', prioridad: 'Alta', estado: 'Programada', descripcion: 'Bomba con fuga en sello' };
    const r = L.actualizarOrden(db, o.id, data, adm);
    expect(r.ok).toBe(true);
    expect(L.byId(db.ordenes, o.id)).toMatchObject({ tecnicoId: 'TEC-01', estado: 'Programada' });
  });

  test('7-9. El técnico ejecuta el servicio, registra repuestos y lo finaliza', () => {
    const tec = tecnicoUsr(db);
    expect(tec.tecnicoId).toBe('TEC-01');
    ctx.stockAntes = L.byId(db.productos, 'INV-011').existencia;
    const r = L.finalizarOrden(db, ctx.orden.id, {
      horaInicio: '15:05', horaFin: '17:30', diagnostico: 'Sello mecánico desgastado', trabajo: 'Sustitución de sello mecánico y prueba hidráulica',
      mediciones: 'Corriente 22A / 220V', repuestos: [{ productoId: 'INV-011', cantidad: 1 }], recomendaciones: 'Revisión en 6 meses', fotos: 2, firmaTecnico: true, firmaCliente: true,
    }, tec);
    expect(r.ok).toBe(true);
    expect(L.byId(db.productos, 'INV-011').existencia).toBe(ctx.stockAntes - 1);
  });

  test('10. El reporte técnico contiene la información de la ejecución', () => {
    const o = L.byId(db.ordenes, ctx.orden.id);
    expect(o.estado).toBe('Finalizada');
    expect(o.ejecucion).toMatchObject({ diagnostico: 'Sello mecánico desgastado', firmaTecnico: true, firmaCliente: true, fotos: 2 });
    expect(o.ejecucion.repuestos).toEqual([{ productoId: 'INV-011', cantidad: 1 }]);
  });

  test('11. Generar factura con los montos de la cotización', () => {
    const r = L.generarFacturaDesdeOrden(db, ctx.orden.id, usuario(db, 'administrativo@sigem.com'), HOY);
    expect(r.ok).toBe(true);
    ctx.factura = r.factura;
    expect(r.factura).toMatchObject({ subtotal: 2800, impuesto: 336, total: 3136, estado: 'Pendiente', clienteId: ctx.cliente.id });
  });

  test('12. Registrar pago parcial y luego el saldo', () => {
    const p1 = L.registrarPago(db, ctx.factura.id, 1136, 'Transferencia', HOY, adm);
    expect(p1.factura.estado).toBe('Parcial');
    expect(p1.saldo).toBe(2000);
    const p2 = L.registrarPago(db, ctx.factura.id, 2000, 'Cheque', HOY, adm);
    expect(p2.factura.estado).toBe('Pagada');
    expect(L.saldoFactura(db, ctx.factura)).toBe(0);
  });

  test('13. Consultar rentabilidad del servicio', () => {
    const r = L.rentabilidadOrden(db, L.byId(db.ordenes, ctx.orden.id));
    expect(r.ingreso).toBe(2800); // sin IVA: el impuesto no es ingreso de la empresa
    // Costos: MO 1000×55% = 550, repuesto sello a costo = 95, transporte 300×70% = 210
    expect(r.costos).toMatchObject({ manoObra: 550, repuestos: 95, transporte: 210, total: 855 });
    expect(r.utilidad).toBe(1945);
    expect(r.margen).toBe(69.5);
  });

  test('La bitácora registra cada operación del flujo', () => {
    const acciones = db.bitacora.map(b => b.accion);
    ['Registró cliente', 'Registró equipo', 'Creó cotización', 'Generó orden de trabajo', 'Finalizó servicio', 'Generó factura', 'Registró pago']
      .forEach(a => expect(acciones).toContain(a));
  });
});

describe('CP-INT-02 Inventario ↔ órdenes ↔ alertas', () => {
  test('Consumir repuestos hasta el mínimo activa la alerta de stock bajo', () => {
    const db = nuevaDB();
    const p = L.byId(db.productos, 'INV-003'); // existencia 15, mínimo 6
    expect(L.stockBajo(p)).toBe(false);
    const r = L.finalizarOrden(db, 'OT-2026-013', { trabajo: 'Cambio de contactores', repuestos: [{ productoId: 'INV-003', cantidad: 9 }] }, tecnicoUsr(db));
    expect(r.ok).toBe(true);
    expect(p.existencia).toBe(6);
    expect(L.stockBajo(p)).toBe(true);
  });

  test('Una finalización rechazada no deja cambios parciales en el inventario', () => {
    const db = nuevaDB();
    const antes = db.productos.map(p => p.existencia);
    const r = L.finalizarOrden(db, 'OT-2026-013', { trabajo: 'x', repuestos: [{ productoId: 'INV-001', cantidad: 1 }, { productoId: 'INV-018', cantidad: 3 }] }, tecnicoUsr(db));
    expect(r.ok).toBe(false);
    expect(db.productos.map(p => p.existencia)).toEqual(antes);
  });
});

describe('CP-INT-03 Facturación ↔ pagos ↔ cuentas por cobrar', () => {
  test('El total por cobrar disminuye exactamente en el monto pagado', () => {
    const db = nuevaDB();
    const cxc = () => L.redondear(db.facturas.reduce((s, f) => s + L.saldoFactura(db, f), 0));
    const antes = cxc();
    L.registrarPago(db, 'FAC-2026-102', 453.15, 'Transferencia', HOY, admin(db));
    expect(cxc()).toBe(L.redondear(antes - 453.15));
  });

  test('Anular una factura la excluye de cuentas por cobrar y permite facturar de nuevo la orden', () => {
    const db = nuevaDB();
    L.cambiarEstadoFactura(db, 'FAC-2026-105', 'Anulada', admin(db));
    expect(L.saldoFactura(db, L.byId(db.facturas, 'FAC-2026-105'))).toBe(0);
    L.cambiarEstadoFactura(db, 'FAC-2026-101', 'Anulada', admin(db));
    expect(L.generarFacturaDesdeOrden(db, 'OT-2026-001', admin(db), HOY).ok).toBe(true);
  });
});

describe('CP-INT-04 Cotización ↔ agenda de técnicos', () => {
  test('Dos órdenes generadas para el mismo técnico no quedan en el mismo horario', () => {
    const db = nuevaDB();
    const adm = admin(db);
    const ids = [];
    for (let i = 0; i < 3; i++) {
      const c = L.crearCotizacion(db, Object.assign(cotizacionValida('CLI-001', 'EQ-001'), { tecnicoId: 'TEC-02' }), adm).cotizacion;
      L.cambiarEstadoCotizacion(db, c.id, 'Aprobada', adm);
      ids.push(L.crearOrdenDesdeCotizacion(db, c.id, adm, HOY).orden);
    }
    const horarios = ids.map(o => o.fecha + ' ' + o.hora);
    expect(new Set(horarios).size).toBe(3);
  });
});
