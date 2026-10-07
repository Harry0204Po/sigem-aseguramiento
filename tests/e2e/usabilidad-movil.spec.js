/**
 * Pruebas de USABILIDAD en dispositivo móvil (diseño responsive) — CP-USA-xx
 * Se ejecutan con el perfil "movil" (Pixel 5, 393×851).
 */
const { test, expect } = require('@playwright/test');
const { abrirApp, iniciarSesion, irA, modal } = require('./utilidades');

const sinDesbordeHorizontal = page => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);

test('CP-USA-01 La pantalla de inicio de sesión se adapta al ancho del teléfono', async ({ page }) => {
  await abrirApp(page);
  await expect(page.locator('#login-screen .brand-title')).toBeInViewport();
  const form = await page.locator('.login-form').boundingBox();
  expect(form.width).toBeGreaterThan(300); // el formulario ocupa el ancho del teléfono, no una columna angosta
  await page.getByRole('button', { name: 'Ingresar al sistema' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Ingresar al sistema' })).toBeInViewport();
  expect(await sinDesbordeHorizontal(page)).toBe(true);
});

test('CP-USA-02 El menú lateral se oculta y se abre con el botón hamburguesa', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await expect(page.locator('.nav-item', { hasText: 'Clientes' })).not.toBeInViewport();
  await page.locator('.hamburger').click();
  await expect(page.locator('.nav-item', { hasText: 'Clientes' })).toBeInViewport();
  await page.locator('.nav-item', { hasText: 'Clientes' }).click();
  await expect(page.locator('.view-title')).toContainText('Clientes');
  await expect(page.locator('.nav-item', { hasText: 'Clientes' })).not.toBeInViewport(); // se cierra al navegar
});

test('CP-USA-03 Las tablas se desplazan dentro de su contenedor sin romper la página', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  for (const m of ['Clientes', 'Órdenes de trabajo', 'Inventario', 'Facturación']) {
    await irA(page, m);
    expect(await sinDesbordeHorizontal(page)).toBe(true);
  }
});

test('CP-USA-04 Los formularios en modal permiten llegar al botón Guardar', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'admin@sigem.com');
  await irA(page, 'Cotizaciones');
  await page.getByRole('button', { name: 'Nueva cotización' }).click();
  const guardar = modal(page).getByRole('button', { name: 'Guardar cotización' });
  await guardar.scrollIntoViewIfNeeded();
  await expect(guardar).toBeInViewport();
});

test('CP-USA-05 El técnico puede ejecutar su orden desde el teléfono', async ({ page }) => {
  await abrirApp(page);
  await iniciarSesion(page, 'tecnico@sigem.com');
  await page.getByRole('button', { name: 'Ejecutar' }).first().click();
  await expect(modal(page)).toContainText('Ejecutar orden');
  const finalizar = modal(page).getByRole('button', { name: 'Finalizar servicio' });
  await finalizar.scrollIntoViewIfNeeded();
  await expect(finalizar).toBeInViewport();
});
