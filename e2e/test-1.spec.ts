import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page
    .getByRole('textbox', { name: 'Email' })
    .fill('340studiospy@gmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('asdfasdf');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page
    .getByRole('link')
    .filter({ hasText: /^Solicitudes$/ })
    .click();
  await page.getByRole('button', { name: 'Solicitudes' }).click();
  await page.getByRole('menuitem', { name: 'Crear solicitud' }).click();
  await page.getByRole('button', { name: 'Seed Me 🌱' }).click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page.locator('[id="accordion-button-\\:r8l\\:"]').click();
  await page.getByRole('link').filter({ hasText: 'Aprobaciones' }).click();
  await page.getByRole('cell', { name: '1', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Aprobar' }).click();
  await page.getByRole('menuitem', { name: 'Cerrar menú' }).click();
  await page
    .getByRole('link')
    .filter({ hasText: /^Solicitudes$/ })
    .click();
  await page
    .locator(
      '.css-19jt8rx > .chakra-card > .chakra-table > tbody > .css-7bfrpv > td'
    )
    .first()
    .click();
  await page.getByRole('menuitem', { name: 'Aceptar y ejecutar' }).click();
  await page.getByRole('button', { name: 'Seed Me 🌱' }).click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page
    .locator(
      '.css-19jt8rx > .chakra-card > .chakra-table > tbody > .css-7bfrpv > td'
    )
    .first()
    .click();
  await page.getByRole('menuitem', { name: 'Crear rendición' }).click();
  await page.getByRole('button', { name: 'Seed Me 🌱' }).click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page.getByRole('menuitem', { name: 'Cerrar menú' }).click();
  await page
    .locator(
      '.css-19jt8rx > .chakra-card > .chakra-table > tbody > .css-7bfrpv > td'
    )
    .first()
    .click();
  await page.getByRole('menuitem', { name: 'Generar devolución' }).click();
  await page.getByRole('button', { name: 'Seed Me 🌱' }).click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await page.getByRole('menuitem', { name: 'Cerrar menú' }).click();
  await page
    .locator(
      '.css-19jt8rx > .chakra-card > .chakra-table > tbody > .css-7bfrpv > td'
    )
    .first()
    .click();
  await page.getByRole('menuitem', { name: 'Anular' }).click();
  await page.getByRole('button', { name: 'Anular' }).click();
  await page.getByRole('menuitem', { name: 'Cerrar menú' }).click();
  await page
    .locator(
      '.css-19jt8rx > .chakra-card > .chakra-table > tbody > .css-1ce10a4 > td'
    )
    .first()
    .click();
  await page.getByRole('menuitem', { name: 'Eliminar' }).click();
  await page.getByRole('button', { name: 'Eliminar' }).click();
  await page.getByRole('menuitem', { name: 'Cerrar menú' }).click();
});
