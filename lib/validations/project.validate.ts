import type { CostCategory, Project, ProjectStage } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { stringReqMinMax } from '../utils/ValidationHelpers';

export const validateProjectStage: z.ZodType<
  Omit<ProjectStage, 'expectedFunds'> & { expectedFunds?: any }
> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    createdById: z.string(),
    updatedById: z.string().nullable(),
    startDate: z.date(),
    endDate: z.date(),
    expectedFunds: z.any().transform((value) => new Prisma.Decimal(value)),
    projectId: z.string(),
    displayName: z.string(),
    currency: z.nativeEnum(Currency),
  })
);
export type FormProjectStage = z.infer<typeof validateProjectStage>;

export type FormCostCategory = Omit<
  CostCategory,
  'openingBalance' | 'executedAmount'
> & {
  openingBalance?: any;
  executedAmount?: any;
};

const validateCostCategory: z.ZodType<FormCostCategory> = z.lazy(() =>
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

export interface FormProject extends Project {
  costCategories: FormCostCategory[];
  projectStages: FormProjectStage[];
}

export const validateProject: z.ZodType<FormProject> = z.lazy(() =>
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
    costCategories: validateCostCategory.array(),
    projectStages: validateProjectStage.array(),
  })
);

export const defaultCostCategoryData: FormCostCategory = {
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

export const defaultProjectStage: FormProjectStage = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  startDate: new Date(),
  endDate: null,
  expectedFunds: new Prisma.Decimal(0),
  projectId: null,
  displayName: '',
  currency: 'PYG',
};

export const defaultProjectData: FormProject = {
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
  costCategories: [defaultCostCategoryData],
  projectStages: [defaultProjectStage],
};
