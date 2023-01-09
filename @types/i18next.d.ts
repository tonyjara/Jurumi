/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next';
// import all namespaces (for the default language, only)
import type signin from '../public/locales/es/signin.json';
import type common from '../public/locales/es/common.json';
import type validation from '../public/locales/es/validation.json';
import type forms from '../public/locales/es/forms.json';

export interface I18nNamespaces {
  common: typeof common;
  signin: typeof signin;
  validation: typeof validation;
  forms: typeof forms;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: I18nNamespaces;
  }
}
