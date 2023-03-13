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

//   await page.getByRole('button', { name: 'Add bank acc' }).click();
//   await page.getByRole('button', { name: 'Seed Me daddy' }).click();
//   await page.getByRole('button', { name: 'Guardar' }).click();
//   await page.getByRole('button', { name: 'Edit BankAcc' }).click();
//   await page.locator('.css-svnjlw').first().click();
//   await page.getByRole('button', { name: 'Banco Gnb' }).click();

//   await page.locator('#input-example').click();
//   await page.locator('#input-example').fill('Gs 200,0000');
//   await page.getByRole('button', { name: 'Editar' }).click();
//   await expect(
//     page.getByRole('heading', {
//       name: /banco gnb/i,
//     })
//   ).toBeVisible();
//   await page.getByRole('button', { name: 'Delete bankAcc' }).first().click();

//   await expect(
//     page.getByRole('heading', {
//       name: /banco gnb/i,
//     })
//   ).not.toBeVisible();
// });
