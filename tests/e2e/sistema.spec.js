/**
 * Pruebas de SISTEMA — CP-SIS-xx
 * Validan el comportamiento del sistema completo desde la interfaz (caja negra).
 */
const { test, expect } = require('@playwright/test');
const { abrirApp, iniciarSesion, irA, ultimoToast, modal } = require('./utilidades');

test.describe('Sistema · Administrador', () => {
  let errores;
  test.beforeEach(async ({ page }) => {
    errores = await abrirApp(page);
    await iniciarSesion(page, 'admin@sigem.com');
  });
  test.afterEach(() => expect(errores).toEqual([]));

  test('CP-SIS-01 El dashboard muestra los 9 indicadores y los 4 gráficos', async ({ page }) => {
    await expect(page.locator('.kpi-card')).toHaveCount(9);
    for (const k of ['Cotizaciones pendientes', 'Órdenes activas', 'Técnicos disponibles', 'Servicios finalizados', 'Facturas pendientes', 'Cuentas por cobrar', 'Ingresos', 'Gastos', 'Rentabilidad'])
      await expect(page.locator('.kpi-grid')).toContainText(k);
    await expect(page.locator('canvas')).toHaveCount(4);
  });

  test('CP-SIS-02 Buscador y filtro de clientes', async ({ page }) => {
    await irA(page, 'Clientes');
    await page.fill('#f-cli-q', 'industrias');
    await expect(page.locator('#clientes-tabla-wrap tbody tr')).toHaveCount(1);
    await page.fill('#f-cli-q', '');
    await page.selectOption('#f-cli-estado', 'Inactivo');
    await expect(page.locator('#clientes-tabla-wrap tbody tr')).toHaveCount(1);
    await expect(page.locator('#clientes-tabla-wrap')).toContainText('Avícola La Esperanza');
    await page.fill('#f-cli-q', 'zzz-no-existe');
    await expect(page.locator('#clientes-tabla-wrap')).toContainText('No se encontraron clientes');
  });

  test('CP-SIS-03 El formulario de cliente valida campos obligatorios y formato de correo', async ({ page }) => {
    await irA(page, 'Clientes');
    await page.getByRole('button', { name: 'Nuevo cliente' }).click();
    await page.fill('#cf-correo', 'correo-invalido');
    await page.getByRole('button', { name: 'Guardar cliente' }).click();
    await expect(ultimoToast(page)).toContainText('El nombre del cliente es obligatorio');
    await expect(ultimoToast(page)).toContainText('correo electrónico no tiene un formato válido');
    await expect(modal(page)).toBeVisible(); // no se pierde lo ingresado
  });

  test('CP-SIS-04 El sistema bloquea asignar un técnico en un horario ocupado', async ({ page }) => {
    await irA(page, 'Órdenes de trabajo');
    await page.getByRole('button', { name: 'Nueva orden' }).click();
    await page.selectOption('#of-cliente', 'CLI-005');
    await page.selectOption('#of-tecnico', 'TEC-01');
    await page.fill('#of-hora', '11:00'); // OT-2026-013 de Carlos Méndez es hoy a las 11:00
    await page.locator('#of-hora').dispatchEvent('change');
    await page.fill('#of-descripcion', 'Prueba de conflicto');
    await expect(page.locator('#of-conflicto')).toContainText('OT-2026-013');
    await page.getByRole('button', { name: 'Guardar orden' }).click();
    await expect(ultimoToast(page)).toContainText('Conflicto de agenda');
    await expect(modal(page)).toBeVisible();
  });

  test('CP-SIS-05 "Generar orden de trabajo" solo aparece en cotizaciones aprobadas sin orden', async ({ page }) => {
    await irA(page, 'Cotizaciones');
    await page.locator('tr', { hasText: 'COT-2026-003' }).locator('button[title="Ver"]').click(); // Enviada
    await expect(page.getByRole('button', { name: 'Generar orden de trabajo' })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.evaluate(() => closeModal());
    await page.locator('tr', { hasText: 'COT-2026-001' }).locator('button[title="Ver"]').click(); // Aprobada con orden
    await expect(modal(page)).toContainText('Ya existe una orden de trabajo');
    await expect(page.getByRole('button', { name: 'Generar orden de trabajo' })).toHaveCount(0);
  });

  test('CP-SIS-06 El inventario muestra alertas visuales de stock bajo', async ({ page }) => {
    const badge = page.locator('.nav-item', { hasText: 'Inventario' }).locator('.nav-badge');
    await expect(badge).toBeVisible();
    await irA(page, 'Inventario');
    await expect(page.locator('.warn-box')).toContainText('por debajo del stock mínimo');
    await page.selectOption('#f-inv-estado', 'Stock bajo');
    const filas = page.locator('#inventario-tabla-wrap tbody tr');
    await expect(filas).toHaveCount(Number(await badge.innerText()));
  });

  test('CP-SIS-07 Rechaza un pago mayor al saldo de la factura', async ({ page }) => {
    await irA(page, 'Pagos y CxC');
    await page.locator('#pagos-facturas-wrap tr', { hasText: 'FAC-2026-105' }).getByRole('button', { name: 'Registrar pago' }).click();
    await page.fill('#pgf-monto', '999999');
    await modal(page).getByRole('button', { name: 'Registrar pago' }).click();
    await expect(ultimoToast(page)).toContainText('excede el saldo pendiente');
  });

  test('CP-SIS-08 Exporta un reporte gerencial a CSV', async ({ page }) => {
    await irA(page, 'Reportes gerenciales');
    await expect(page.locator('.view-root .card')).toHaveCount(10);
    const descarga = page.waitForEvent('download');
    await page.locator('.card', { hasText: 'Servicios por técnico' }).getByRole('button', { name: 'CSV' }).click();
    expect((await descarga).suggestedFilename()).toBe('SIGEM_Servicios_por_tecnico.csv');
  });

  test('CP-SIS-09 La búsqueda global encuentra y abre una orden', async ({ page }) => {
    await page.fill('#global-search', 'OT-2026-002');
    await page.locator('#global-search-results .dropdown-item').first().click();
    await expect(modal(page)).toContainText('Orden OT-2026-002');
  });

  test('CP-SIS-10 La agenda de técnicos muestra las órdenes programadas para hoy', async ({ page }) => {
    await irA(page, 'Órdenes de trabajo');
    await page.getByRole('button', { name: 'Agenda de técnicos' }).click();
    await expect(page.locator('#ordenes-content tr', { hasText: 'Carlos Méndez' })).toContainText('11:00 · #013');
  });

  test('CP-SIS-11 El reporte técnico de una orden finalizada se puede imprimir/descargar', async ({ page }) => {
    await page.evaluate(() => APP.verReporteTecnico('OT-2026-001'));
    for (const t of ['Cliente', 'Equipo', 'Técnico', 'Problema reportado', 'Diagnóstico', 'Trabajo realizado', 'Repuestos utilizados', 'Mediciones', 'Recomendaciones', 'Fotografías', 'Firma del técnico', 'Firma del cliente'])
      await expect(modal(page)).toContainText(t);
    await expect(modal(page).getByRole('button', { name: /Descargar PDF/ })).toBeVisible();
  });
});
