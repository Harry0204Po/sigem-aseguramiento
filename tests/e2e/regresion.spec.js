/**
 * Pruebas de REGRESIÓN — CP-REG-xx
 * Se ejecutan en cada cambio (GitHub Actions) para asegurar que lo que ya
 * funcionaba no se rompa, y que los defectos corregidos no vuelvan a aparecer.
 */
const { test, expect } = require('@playwright/test');
const { abrirApp, iniciarSesion, irA, modal } = require('./utilidades');

const MENU = {
  'admin@sigem.com': ['Dashboard', 'Clientes', 'Equipos', 'Cotizaciones', 'Órdenes de trabajo', 'Inventario', 'Facturación', 'Pagos y CxC', 'Gastos', 'Rentabilidad', 'Reportes gerenciales', 'Usuarios y seguridad', 'Guía de la demo'],
  'administrativo@sigem.com': ['Dashboard', 'Clientes', 'Equipos', 'Cotizaciones', 'Órdenes de trabajo', 'Facturación', 'Pagos y CxC', 'Guía de la demo'],
  'tecnico@sigem.com': ['Dashboard', 'Mi panel técnico', 'Guía de la demo'],
};

for (const [email, modulos] of Object.entries(MENU)) {
  test(`CP-REG-01 Todos los módulos cargan sin errores para ${email}`, async ({ page }) => {
    const errores = await abrirApp(page);
    await iniciarSesion(page, email);
    for (const m of modulos) {
      await irA(page, m);
      await expect(page.locator('.view-title')).toBeVisible();
    }
    expect(errores).toEqual([]);
  });
}

test('CP-REG-02 [Defecto corregido] Las fechas de la demo son relativas a hoy: el técnico tiene órdenes del día', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'tecnico@sigem.com');
  const kpiHoy = page.locator('.kpi-card', { hasText: 'Órdenes de hoy' }).locator('.kpi-val');
  await expect(kpiHoy).not.toHaveText('0');
});

test('CP-REG-03 [Defecto corregido] Los indicadores de ingresos y gastos no aparecen en cero', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  for (const k of ['Ingresos (últimos 30 días)', 'Gastos (últimos 30 días)'])
    await expect(page.locator('.kpi-card', { hasText: k }).locator('.kpi-val')).not.toHaveText('Q 0.00');
});

test('CP-REG-04 [Defecto corregido] "Mi perfil" funciona para roles sin acceso a Usuarios', async ({ page }) => {
  const errores = await abrirApp(page);
  await iniciarSesion(page, 'tecnico@sigem.com');
  await page.locator('.user-chip').click();
  await page.locator('.dropdown-item', { hasText: 'Mi perfil' }).click();
  await expect(modal(page)).toContainText('tecnico@sigem.com');
  await expect(modal(page)).toContainText('Mi panel técnico');
  expect(errores).toEqual([]);
});

test('CP-REG-05 [Defecto corregido] Una orden no puede marcarse "Finalizada" desde el formulario de edición', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await page.evaluate(() => APP.formOrden('OT-2026-006'));
  await page.selectOption('#of-estado', 'Finalizada');
  await page.getByRole('button', { name: 'Guardar orden' }).click();
  await expect(page.locator('#toast-root .toast').last()).toContainText('panel técnico');
});

test('CP-REG-06 Los datos registrados se reinician al recargar (comportamiento esperado del prototipo)', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  const total = await page.evaluate(() => DB.clientes.length);
  await page.evaluate(() => SIGEM_LOGICA.crearCliente(DB, { nombre: 'Temporal', nit: '111-1' }, STATE.user));
  expect(await page.evaluate(() => DB.clientes.length)).toBe(total + 1);
  await page.reload();
  expect(await page.evaluate(() => DB.clientes.length)).toBe(total);
});

test('CP-REG-07 [Defecto corregido] Un usuario Técnico creado por el administrador puede usar su panel', async ({ page }) => {
  const errores = await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Usuarios y seguridad');
  await page.getByRole('button', { name: 'Nuevo usuario' }).click();
  await page.fill('#uf-nombre', 'Mario Cifuentes');
  await page.fill('#uf-email', 'mcifuentes@sigem.com');
  await page.selectOption('#uf-rol', 'Técnico');
  await page.getByRole('button', { name: 'Guardar usuario' }).click();
  await expect(page.locator('#toast-root .toast').last()).toContainText('creado');
  await page.locator('.user-chip').click();
  await page.locator('.dropdown-item', { hasText: 'Cerrar sesión' }).click();
  await page.fill('#login-email', 'mcifuentes@sigem.com');
  await page.fill('#login-pass', '123456');
  await page.press('#login-pass', 'Enter');
  await expect(page.locator('.view-title')).toContainText('Mi panel técnico');
  await expect(page.locator('.view-sub')).toContainText('Mario Cifuentes');
  expect(errores).toEqual([]);
});
