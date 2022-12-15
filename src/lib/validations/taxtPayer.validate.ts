import type { TaxPayer } from '@prisma/client';
import * as z from 'zod';

export const taxPayerValidate: z.ZodType<TaxPayer> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    createdById: z.string(),
    updatedById: z.string().nullable(),
    razonSocial: z
      .string()
      .min(3, 'Favor ingrese la razón social.')
      .max(128, 'Has excedido el límite de caractéres (128).'),
    ruc: z
      .string()
      .min(5, 'Favor ingrese el ruc.')
      .max(14, 'Has excedido el límite de caractéres (14).'),
    fantasyName: z.string(),
    archived: z.boolean(),
    softDeleted: z.boolean(),
  })
);

export type TaxPayerFormType = z.infer<typeof taxPayerValidate>;

export const defaultTaxPayer: TaxPayerFormType = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: '',
  razonSocial: '',
  ruc: '',
  fantasyName: '',
  archived: false,
  softDeleted: false,
};
