/**
 * Pruebas de USABILIDAD en escritorio — CP-USA-1x
 * Retroalimentación al usuario, navegación por teclado y consistencia de la interfaz.
 */
const { test, expect } = require('@playwright/test');
const { abrirApp, iniciarSesion, irA, ultimoToast, modal } = require('./utilidades');

test('CP-USA-10 Se puede iniciar sesión solo con el teclado (Enter)', async ({ page }) => {
  await abrirApp(page);
  await page.fill('#login-email', 'admin@sigem.com');
  await page.press('#login-email', 'Enter');
  await expect(page.locator('#login-pass')).toBeFocused();
  await page.keyboard.type('123456');
  await page.keyboard.press('Enter');
  await expect(ultimoToast(page)).toContainText('Bienvenido(a), Ana');
});

test('CP-USA-11 Cada acción importante muestra una notificación de confirmación', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Gastos');
  await page.getByRole('button', { name: 'Nuevo gasto' }).click();
  await page.fill('#gf-descripcion', 'Combustible de prueba');
  await page.fill('#gf-monto', '250');
  await page.getByRole('button', { name: 'Guardar gasto' }).click();
  await expect(ultimoToast(page)).toContainText('Gasto GAS-013 registrado');
  await expect(page.locator('#gastos-tabla-wrap')).toContainText('Combustible de prueba');
});

test('CP-USA-12 El menú resalta el módulo activo y cada vista tiene título y descripción', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Equipos');
  await expect(page.locator('.nav-item.active')).toHaveText('Equipos');
  await expect(page.locator('.view-title')).toHaveText('Equipos');
  await expect(page.locator('.view-sub')).not.toBeEmpty();
});

test('CP-USA-13 Los estados se muestran con etiquetas de color consistentes', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Facturación');
  await expect(page.locator('tr', { hasText: 'FAC-2026-101' }).locator('.badge-verde')).toHaveText('Pagada');
  await expect(page.locator('tr', { hasText: 'FAC-2026-106' }).locator('.badge-rojo')).toHaveText('Anulada');
});

test('CP-USA-14 La guía de la demo explica el flujo de 13 pasos y permite ir a cada módulo', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Guía de la demo');
  await expect(page.locator('.flow-step')).toHaveCount(13);
  await page.locator('.flow-step', { hasText: 'Registrar cliente' }).getByRole('button', { name: /Ir/ }).click();
  await expect(page.locator('.view-title')).toHaveText('Clientes');
  await expect(modal(page)).toContainText('Nuevo cliente');
});

test('CP-USA-15 El nombre SIGEM y su subtítulo están siempre visibles', async ({ page }) => {
  await abrirApp(page);
  await expect(page.locator('#login-screen')).toContainText('Sistema Integral de Gestión Electromecánica');
  await iniciarSesion(page, 'admin@sigem.com');
  await expect(page.locator('.sidebar-brand')).toContainText('SIGEM');
  await expect(page).toHaveTitle(/SIGEM · Sistema Integral de Gestión Electromecánica/);
});
