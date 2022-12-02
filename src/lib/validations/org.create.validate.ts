import type { Organization } from '@prisma/client';
import * as z from 'zod';

export const validateOrgCreate: z.ZodType<Organization> = z.lazy(() =>
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
    moneyRequestApprovers: z.string().array(),
    moneyAdministrators: z.string().array(),
    allowedUsers: z.string().array(),
  })
);

export type orgCreateData = z.infer<typeof validateOrgCreate>;

export const defaultOrgData: orgCreateData = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  displayName: '',
  allowedUsers: [],
  moneyAdministrators: [],
  moneyRequestApprovers: [],
  archived: false,
  softDeleted: false,
};
