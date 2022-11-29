import type { Project } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

type withMoney = Omit<Project, 'assignedMoney'> & { assignedMoney?: any };

export const validateProject: z.ZodType<withMoney> = z.lazy(() =>
  z.object({
    id: z.string(),
    displayName: stringReqMinMax(
      'Favor ingrese un nombre para el proyecto.',
      2,
      64
    ),
    assignedMoney: z.any().transform((value) => new Prisma.Decimal(value)),
    assignedMoneyCurrency: z.nativeEnum(Currency),
    organizationId: z.string({
      required_error: 'Favor seleccione una organización.',
    }),
    allowedUsers: z.string().array(),
    softDeleted: z.boolean(),
    updatedAt: z.date().nullable(),
    updatedById: z.string().nullable(),
    archived: z.boolean(),
    createdAt: z.date(),
    createdById: z.string(),
  })
);

export type projectValidateData = z.infer<typeof validateProject>;

export const defaultProjectValues: projectValidateData = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  displayName: '',
  assignedMoney: new Prisma.Decimal(0.0),
  assignedMoneyCurrency: 'PYG',
  organizationId: '',
  allowedUsers: [],
  archived: false,
  softDeleted: false,
};
