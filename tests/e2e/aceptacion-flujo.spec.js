/**
 * Prueba de ACEPTACIÓN — CP-ACE-01
 * Ejecuta, desde la interfaz y como lo haría el usuario final, el flujo completo
 * de 13 pasos definido en el requerimiento 19 de SIGEM.
 */
const { test, expect } = require('@playwright/test');
const { abrirApp, iniciarSesion, cerrarSesion, irA, ultimoToast, modal } = require('./utilidades');

test('CP-ACE-01 Flujo completo del negocio desde la interfaz (13 pasos)', async ({ page }) => {
  const errores = await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');

  await test.step('1. Registrar cliente', async () => {
    await irA(page, 'Clientes');
    await page.getByRole('button', { name: 'Nuevo cliente' }).click();
    await page.fill('#cf-nombre', 'Hotel Pacífico, S.A.');
    await page.fill('#cf-nit', '1234567-8');
    await page.fill('#cf-telefono', '2345-6789');
    await page.fill('#cf-correo', 'mantenimiento@hotelpacifico.gt');
    await page.fill('#cf-direccion', 'Zona 10, Guatemala');
    await page.getByRole('button', { name: 'Guardar cliente' }).click();
    await expect(ultimoToast(page)).toContainText('CLI-011 registrado');
    await expect(page.locator('#clientes-tabla-wrap')).toContainText('Hotel Pacífico, S.A.');
  });

  await test.step('2. Registrar equipo', async () => {
    await irA(page, 'Equipos');
    await page.getByRole('button', { name: 'Nuevo equipo' }).click();
    await page.selectOption('#ef-cliente', 'CLI-011');
    await page.selectOption('#ef-tipo', 'Bomba centrífuga');
    await page.fill('#ef-marca', 'Grundfos');
    await page.fill('#ef-modelo', 'CR10');
    await page.fill('#ef-hp', '10');
    await page.fill('#ef-voltaje', '220V');
    await page.fill('#ef-serie', 'GF-E2E-001');
    await page.fill('#ef-ubicacion', 'Cuarto de bombas');
    await page.getByRole('button', { name: 'Guardar equipo' }).click();
    await expect(ultimoToast(page)).toContainText('EQ-016 registrado');
  });

  await test.step('3. Crear cotización y verificar el cálculo automático', async () => {
    await irA(page, 'Cotizaciones');
    await page.getByRole('button', { name: 'Nueva cotización' }).click();
    await page.selectOption('#cotf-cliente', 'CLI-011');
    await expect(page.locator('#cotf-equipo')).toHaveValue('EQ-016');
    await page.selectOption('#cotf-tecnico', 'TEC-01');
    const lineas = [['Mano de obra técnica', 'Mano de obra', '1000'], ['Sello mecánico 5/8"', 'Repuestos', '1500'], ['Transporte a sitio', 'Transporte', '300']];
    for (let i = 0; i < lineas.length; i++) {
      if (i > 0) await page.getByRole('button', { name: 'Agregar línea' }).click();
      const fila = page.locator('#cot-items-wrap tbody tr').nth(i);
      await fila.locator('input').nth(0).fill(lineas[i][0]);
      await fila.locator('input').nth(0).press('Tab');
      await fila.locator('select').selectOption(lineas[i][1]);
      await fila.locator('input').nth(2).fill(lineas[i][2]);
      await fila.locator('input').nth(2).press('Tab');
    }
    const totales = page.locator('#cot-totales');
    await expect(totales).toContainText('Q 2,800.00');
    await expect(totales).toContainText('Q 336.00');
    await expect(totales).toContainText('Q 3,136.00');
    await page.getByRole('button', { name: 'Guardar cotización' }).click();
    await expect(ultimoToast(page)).toContainText('COT-2026-011 creada en estado Borrador');
  });

  await test.step('4. Aprobar cotización', async () => {
    await page.locator('tr', { hasText: 'COT-2026-011' }).locator('button[title="Ver"]').click();
    await expect(page.getByRole('button', { name: 'Generar orden de trabajo' })).toHaveCount(0);
    await page.selectOption('#cotf-cambio-estado', 'Aprobada');
    await page.getByRole('button', { name: 'Actualizar estado' }).click();
    await expect(ultimoToast(page)).toContainText('"Aprobada"');
  });

  await test.step('5. Generar orden de trabajo', async () => {
    await page.getByRole('button', { name: 'Generar orden de trabajo' }).click();
    await expect(ultimoToast(page)).toContainText('OT-2026-014 generada');
    await expect(modal(page)).toContainText('Orden OT-2026-014');
  });

  await test.step('6. Asignar técnico y programar (con validación de agenda)', async () => {
    await modal(page).getByRole('button', { name: 'Editar' }).click();
    await page.selectOption('#of-tecnico', 'TEC-01');
    const hoy = await page.evaluate(() => window.SIGEM_LOGICA.todayStr());
    await page.fill('#of-fecha', hoy);
    await page.locator('#of-fecha').dispatchEvent('change');
    await page.fill('#of-hora', '11:00'); // Carlos Méndez ya tiene OT-2026-013 a esa hora
    await page.locator('#of-hora').dispatchEvent('change');
    await expect(page.locator('#of-conflicto')).toContainText('Conflicto de agenda detectado');
    await page.fill('#of-hora', '15:00');
    await page.locator('#of-hora').dispatchEvent('change');
    await expect(page.locator('#of-conflicto')).toContainText('Sin conflictos');
    await page.selectOption('#of-estado', 'Programada');
    await page.getByRole('button', { name: 'Guardar orden' }).click();
    await expect(ultimoToast(page)).toContainText('Orden actualizada');
  });

  await test.step('7-9. El técnico ejecuta, registra repuestos y finaliza el servicio', async () => {
    await cerrarSesion(page);
    await iniciarSesion(page, 'tecnico@sigem.com');
    await expect(page.locator('.view-title')).toContainText('Mi panel técnico');
    await page.locator('tr', { hasText: 'OT-2026-014' }).getByRole('button', { name: 'Ejecutar' }).click();
    await page.fill('#ex-diagnostico', 'Sello mecánico desgastado');
    await page.fill('#ex-trabajo', 'Sustitución de sello mecánico y prueba hidráulica');
    await page.fill('#ex-mediciones', 'Corriente 22A / Voltaje 220V');
    await page.fill('#ex-recomendaciones', 'Revisión preventiva en 6 meses');
    await page.getByRole('button', { name: 'Agregar repuesto' }).click();
    await page.locator('#ejec-repuestos-wrap select').selectOption('INV-011');
    await page.locator('.photo-slot.add').click();
    await page.locator('#firma-tec-box').click();
    await page.locator('#firma-cli-box').click();
    await page.getByRole('button', { name: 'Finalizar servicio' }).click();
    await expect(ultimoToast(page)).toContainText('inventario descontado');
  });

  await test.step('10. Se genera el reporte técnico', async () => {
    await expect(modal(page)).toContainText('Reporte técnico — OT-2026-014');
    await expect(modal(page)).toContainText('Sello mecánico desgastado');
    await expect(modal(page)).toContainText('Sello mecánico 5/8"');
    await expect(modal(page).getByRole('button', { name: /Descargar PDF/ })).toBeVisible();
    await modal(page).getByRole('button', { name: 'Cerrar' }).click();
  });

  await test.step('11. Generar factura', async () => {
    await cerrarSesion(page);
    await iniciarSesion(page, 'admin@sigem.com');
    await irA(page, 'Facturación');
    await page.getByRole('button', { name: 'Generar factura de OT-2026-014' }).click();
    await expect(ultimoToast(page)).toContainText('FAC-2026-107 generada por Q 3,136.00');
  });

  await test.step('12. Registrar pago parcial y total', async () => {
    await modal(page).getByRole('button', { name: 'Registrar pago' }).click();
    await page.selectOption('#pgf-tipo', 'parcial');
    await page.fill('#pgf-monto', '1136');
    await page.getByRole('button', { name: 'Registrar pago' }).last().click();
    await expect(ultimoToast(page)).toContainText('"Parcial"');
    await irA(page, 'Pagos y CxC');
    await page.locator('#pagos-facturas-wrap tr', { hasText: 'FAC-2026-107' }).getByRole('button', { name: 'Registrar pago' }).click();
    await expect(page.locator('#pgf-monto')).toHaveValue('2000');
    await modal(page).getByRole('button', { name: 'Registrar pago' }).click();
    await expect(ultimoToast(page)).toContainText('"Pagada"');
  });

  await test.step('13. Consultar rentabilidad', async () => {
    await irA(page, 'Rentabilidad');
    const fila = page.locator('tr', { hasText: 'OT-2026-014' });
    await expect(fila).toContainText('Q 2,800.00'); // ingreso sin IVA
    await expect(fila).toContainText('Q 1,945.00'); // utilidad
    await expect(fila).toContainText('69.5%');
  });

  await test.step('El inventario refleja el repuesto utilizado', async () => {
    await irA(page, 'Inventario');
    await expect(page.locator('tr', { hasText: 'INV-011' }).locator('td').nth(3)).toHaveText('17'); // existencia inicial 18
  });

  expect(errores).toEqual([]);
});
