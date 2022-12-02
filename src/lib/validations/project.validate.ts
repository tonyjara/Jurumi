import type { Project } from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

export const validateProject: z.ZodType<Project> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    createdById: z.string(),
    updatedAt: z.date().nullable(),
    updatedById: z.string().nullable(),
    displayName: stringReqMinMax(
      'Favor ingrese un nombre para el proyecto.',
      2,
      64
    ),
    description: stringReqMinMax(
      'Favor ingrese una descripción proyecto.',
      6,
      128
    ),
    organizationId: z.string({
      required_error: 'Favor seleccione una organización.',
    }),
    allowedUsers: z.string().array(),
    softDeleted: z.boolean(),
    archived: z.boolean(),
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
  organizationId: '',
  allowedUsers: [],
  archived: false,
  softDeleted: false,
  description: '',
};
