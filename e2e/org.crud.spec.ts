export {};
test('asdf', () => {});

// import { test, expect } from '@playwright/test';

// test.skip('test', async ({ page }) => {
//   await page.goto('/home');
//   await page.getByLabel('Correo electrónico').click();
//   await page.getByLabel('Correo electrónico').fill('tony@tony.com');
//   await page.getByLabel('Correo electrónico').press('Tab');
//   await page.getByLabel('Contraseña').fill('asdfasdf');
//   await page.getByLabel('Contraseña').press('Enter');
//   await page.getByRole('button', { name: 'Views' }).click();
//   await page.getByText('Crear Org').click();

//   await page.getByLabel('Nombre de su organización').fill('La org');
//   await page.getByLabel('Nombre de su organización').press('Enter');
//   await page
//     .getByRole('listitem')
//     .filter({
//       hasText:
//         'La orgResumen3 Cuentas bancarias5 Proyectos20 Desembolsos200 TransaccionesProyec',
//     })
//     .getByRole('button', { name: 'Edit Org' })
//     .click();
//   await page.getByLabel('Nombre de su organización').fill('La org2');
//   await page.getByRole('button', { name: 'Editar' }).click();
//   await page
//     .getByRole('listitem')
//     .filter({
//       hasText:
//         'La org2Resumen3 Cuentas bancarias5 Proyectos20 Desembolsos200 TransaccionesProye',
//     })
//     .getByRole('button', { name: 'Delete Org' })
//     .click();
//   await expect(
//     page.getByRole('heading', {
//       name: /la org2/i,
//     })
//   ).not.toBeVisible();
// });
