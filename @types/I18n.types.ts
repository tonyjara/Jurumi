import type { I18nNamespaces } from './i18next';

type Permutations<
  T extends keyof I18nNamespaces,
  U extends string = T
> = T extends any ? `${T}:${U}` : never;

type joined<T extends keyof I18nNamespaces> = Permutations<
  T,
  keyof I18nNamespaces[T] & string
>;

export type CustomTFunction<T extends keyof I18nNamespaces> = (
  x: joined<T>
) => any;
