const { expect } = require('@playwright/test');

const URL_APP = '/index.html';

/** Abre la aplicación y registra los errores de JavaScript que ocurran. */
async function abrirApp(page) {
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.goto(URL_APP);
  await expect(page.locator('#login-screen')).toBeVisible();
  return errores;
}

/** Inicia sesión con el botón de acceso rápido del rol indicado. */
async function iniciarSesion(page, email) {
  await page.locator('.demo-user-btn', { hasText: email }).click();
  await expect(page.locator('#app-shell')).toBeVisible();
}

async function cerrarSesion(page) {
  await page.locator('.user-chip').click();
  await page.locator('.dropdown-item', { hasText: 'Cerrar sesión' }).click();
  await expect(page.locator('#login-screen')).toBeVisible();
}

/** Navega con el menú lateral (en móvil abre primero el menú hamburguesa). */
async function irA(page, etiqueta) {
  const item = page.locator('.nav-item', { hasText: etiqueta });
  // En pantallas angostas el menú lateral está oculto: se abre con el botón hamburguesa.
  if (await page.locator('.hamburger').isVisible()) await page.locator('.hamburger').click();
  await item.click();
}

const ultimoToast = page => page.locator('#toast-root .toast').last();
const modal = page => page.locator('#active-modal .modal-box');

module.exports = { URL_APP, abrirApp, iniciarSesion, cerrarSesion, irA, ultimoToast, modal };
