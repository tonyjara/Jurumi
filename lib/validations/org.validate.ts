import type { Organization } from '@prisma/client';
import * as z from 'zod';

export interface FormOrganization extends Organization {
  moneyAdministrators: {
    id: string;
    displayName: string;
  }[];
  moneyRequestApprovers: {
    id: string;
    displayName: string;
  }[];
}

export const validateOrganization: z.ZodType<FormOrganization> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    createdById: z.string(),
    updatedById: z.string().nullable(),
    displayName: z
      .string({ required_error: 'Favor ingrese un nombre para su org.' })
      .max(64, { message: 'Has excedido el límite de caractéres (64)' })
      .min(3, { message: 'El nombre debe tener al menos caractéres (64)' }),
    softDeleted: z.boolean(),
    updatedAt: z.date().nullable(),
    archived: z.boolean(),
    moneyRequestApprovers: z
      .object({ id: z.string(), displayName: z.string() })
      .array(),
    moneyAdministrators: z
      .object({ id: z.string(), displayName: z.string() })
      .array(),
  })
);

export const defaultOrgData: FormOrganization = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  displayName: '',
  archived: false,
  softDeleted: false,
  moneyAdministrators: [],
  moneyRequestApprovers: [],
};
