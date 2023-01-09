import type { TaxPayer } from '@prisma/client';
import * as z from 'zod';

export const validateTaxPayer: z.ZodType<TaxPayer> = z.lazy(() =>
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

export type FormTaxPayer = z.infer<typeof validateTaxPayer>;

export const defaultTaxPayer: FormTaxPayer = {
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
