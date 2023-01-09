// global-setup.ts
import type { FullConfig } from '@playwright/test';
import { expect } from '@playwright/test';
import { chromium } from '@playwright/test';
import path from 'node:path';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ locale: 'es' });
  // const storagePath = path.resolve(__dirname, 'storageState.json');
  // const sessionToken = '04456e41-ec3b-4edf-92c1-48c14e57cacd2';

  await page.goto('http://localhost:3000/');
  await page.getByLabel('Correo electrónico').click();
  await page.getByLabel('Correo electrónico').fill('tony@tony.com');
  await page.getByLabel('Correo electrónico').press('Tab');
  await page.getByLabel('Contraseña').fill('asdfasdf');
  await page.getByLabel('Contraseña').press('Enter');

  await expect(page.getByRole('button', { name: 'Views' })).toBeVisible();

  // const context = await browser.newContext({ storageState: storagePath });
  // await context.addCookies([
  //   {
  //     name: 'next-auth.session-token',
  //     value: sessionToken,
  //     domain: 'localhost',
  //     path: '/',
  //     httpOnly: true,
  //     sameSite: 'Lax',
  //     expires: 1661406204,
  //   },
  // ]);
  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({ path: './e2e/setup/storageState.json' });
  await browser.close();
}

export default globalSetup;
