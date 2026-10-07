/**
 * Pruebas de SEGURIDAD desde la interfaz — CP-SEG-2x
 * Autenticación, control de acceso por rol (RBAC), confidencialidad e inyección de código.
 */
const { test, expect } = require('@playwright/test');
const { abrirApp, iniciarSesion, cerrarSesion, irA, ultimoToast } = require('./utilidades');

test('CP-SEG-20 Credenciales incorrectas no permiten el ingreso', async ({ page }) => {
  await abrirApp(page);
  await page.fill('#login-email', 'admin@sigem.com');
  await page.fill('#login-pass', 'clave-incorrecta');
  await page.getByRole('button', { name: 'Ingresar al sistema' }).click();
  await expect(page.locator('#login-error')).toHaveText('Correo o contraseña incorrectos.');
  await expect(page.locator('#app-shell')).toBeHidden();
  await expect(page.locator('#login-pass')).toHaveAttribute('type', 'password');
});

test('CP-SEG-21 Un usuario inactivo no puede iniciar sesión', async ({ page }) => {
  await abrirApp(page);
  await page.fill('#login-email', 'fruiz@sigem.com');
  await page.fill('#login-pass', '123456');
  await page.press('#login-pass', 'Enter');
  await expect(page.locator('#login-error')).toContainText('inactivo');
  await expect(page.locator('#app-shell')).toBeHidden();
});

test('CP-SEG-22 El Técnico solo ve sus módulos y no puede abrir Rentabilidad', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'tecnico@sigem.com');
  const menu = await page.locator('.nav-item > span:not(.nav-badge)').allInnerTexts();
  expect(menu).toEqual(['Dashboard', 'Mi panel técnico', 'Guía de la demo']);
  await page.evaluate(() => APP.nav('rentabilidad'));
  await expect(ultimoToast(page)).toContainText('No tiene permisos');
  await expect(page.locator('.view-title')).toContainText('Mi panel técnico');
  // El dashboard del técnico no expone indicadores financieros
  await irA(page, 'Dashboard');
  await expect(page.locator('.kpi-grid')).not.toContainText('Ingresos');
  await expect(page.locator('.kpi-grid')).not.toContainText('Rentabilidad');
});

test('CP-SEG-23 El Técnico no puede ver órdenes de otros técnicos ni datos de clientes', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'tecnico@sigem.com');
  await page.evaluate(() => APP.abrirEjecucion('OT-2026-005')); // asignada a José Ramírez
  await expect(ultimoToast(page)).toContainText('No tiene permisos para acceder a esta orden');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.fill('#global-search', 'Industrias');
  await expect(page.locator('#global-search-results')).toContainText('Sin resultados');
  await page.fill('#global-search', 'FAC-2026');
  await expect(page.locator('#global-search-results')).toContainText('Sin resultados');
});

test('CP-SEG-24 El rol Administrativo no ve rentabilidad, gastos, reportes, inventario ni usuarios', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'administrativo@sigem.com');
  const menu = await page.locator('#sidebar-nav').innerText();
  for (const m of ['Clientes', 'Cotizaciones', 'Facturación', 'Pagos y CxC']) expect(menu).toContain(m);
  for (const m of ['Rentabilidad', 'Gastos', 'Reportes gerenciales', 'Inventario', 'Usuarios y seguridad']) expect(menu).not.toContain(m);
});

test('CP-SEG-25 Los datos ingresados se muestran como texto (protección contra XSS)', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Clientes');
  await page.getByRole('button', { name: 'Nuevo cliente' }).click();
  const malicioso = '<img src=x onerror="window.__xss=1">Cliente';
  await page.fill('#cf-nombre', malicioso);
  await page.fill('#cf-nit', '999999-9');
  await page.getByRole('button', { name: 'Guardar cliente' }).click();
  await expect(page.locator('#clientes-tabla-wrap')).toContainText(malicioso);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});

test('CP-SEG-26 Cerrar sesión regresa al login, limpia credenciales y registra la acción en bitácora', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await cerrarSesion(page);
  await expect(page.locator('#login-email')).toHaveValue('');
  await expect(page.locator('#login-pass')).toHaveValue('');
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Usuarios y seguridad');
  await page.getByRole('button', { name: 'Bitácora de actividad' }).click();
  await expect(page.locator('#usuarios-content')).toContainText('Cierre de sesión');
});
