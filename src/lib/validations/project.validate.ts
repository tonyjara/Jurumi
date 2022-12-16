import type { CostCategory, Project } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

type withMoney = Omit<CostCategory, 'openingBalance' | 'executedAmount'> & {
  openingBalance?: any;
  executedAmount?: any;
};

const CostCategoryModel: z.ZodType<withMoney> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    createdById: z.string(),
    updatedById: z.string().nullable(),
    displayName: z.string(),
    openingBalance: z.any().transform((value) => new Prisma.Decimal(value)),
    executedAmount: z.any().transform((value) => new Prisma.Decimal(value)),
    projectId: z.string().nullable(),
    currency: z.nativeEnum(Currency),
  })
);

type costCatWithMoney = z.infer<typeof CostCategoryModel>;

export interface ProjectWithCostCat extends Project {
  costCategories: costCatWithMoney[];
}

export const validateProject: z.ZodType<ProjectWithCostCat> = z.lazy(() =>
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
    softDeleted: z.boolean(),
    archived: z.boolean(),
    costCategories: CostCategoryModel.array(),
  })
);

export type projectValidateData = z.infer<typeof validateProject>;

export const defaultCostCat: costCatWithMoney = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  displayName: '',
  currency: 'PYG',
  openingBalance: new Prisma.Decimal(0),
  executedAmount: new Prisma.Decimal(0),
  projectId: null,
};

export const defaultProjectValues: projectValidateData = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  displayName: '',
  organizationId: '',
  archived: false,
  softDeleted: false,
  description: '',
  costCategories: [defaultCostCat],
};
