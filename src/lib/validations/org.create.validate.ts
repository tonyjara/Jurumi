import type { Organization } from '@prisma/client';
import * as z from 'zod';

export const validateOrgCreate: z.ZodType<Organization> = z.lazy(() =>
  z.object({
    id: z.string(),
    displayName: z
      .string({ required_error: 'Favor ingrese un nombre para su org.' })
      .max(64, { message: 'Has excedido el límite de caractéres (64)' })
      .min(3, { message: 'El nombre debe tener al menos caractéres (64)' }),
    softDeleted: z.boolean(),
    updatedAt: z.date().nullable(),
    updatedById: z.string().nullable(),
    archived: z.boolean(),
    createdAt: z.date(),
    createdById: z.string(),
    accountId: z.string(),
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
  accountId: '',
  allowedUsers: [],
  archived: false,
  softDeleted: false,
};
