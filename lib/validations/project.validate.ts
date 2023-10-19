import type { CostCategory, Project } from "@prisma/client";
import { ProjectType } from "@prisma/client";
import { Currency } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { stringReqMinMax } from "../utils/ValidationHelpers";

export type FormCostCategory = Omit<CostCategory, "assignedAmount"> & {
  assignedAmount?: any;
};

const validateCostCategory: z.ZodType<FormCostCategory> = z.lazy(() =>
  z.object({
    assignedAmount: z.any().transform((value) => new Prisma.Decimal(value)),
    createdAt: z.date(),
    createdById: z.string(),
    currency: z.nativeEnum(Currency),
    displayName: stringReqMinMax("Favor ingrese un nombre", 3, 32),
    id: z.string(),
    projectId: z.string().nullable(),
    referenceExchangeRate: z.number(),
    updatedAt: z.date().nullable(),
    updatedById: z.string().nullable(),
  }),
);

export interface FormProject extends Project {
  costCategories: FormCostCategory[];
}

export const validateProject: z.ZodType<FormProject> = z.lazy(() =>
  z.object({
    archived: z.boolean(),
    acronym: z
      .string({ invalid_type_error: "Favor ingrese las siglas del proyecto" })
      .min(1),
    costCategories: validateCostCategory.array(),
    createdAt: z.date(),
    createdById: z.string(),
    description: stringReqMinMax(
      "Favor ingrese una descripción proyecto.",
      6,
      128,
    ),
    displayName: stringReqMinMax(
      "Favor ingrese un nombre para el proyecto.",
      2,
      64,
    ),
    endDate: z.date().nullable(),
    id: z.string(),
    organizationId: z.string({
      required_error: "Favor seleccione una organización.",
    }),
    projectType: z.nativeEnum(ProjectType),
    softDeleted: z.boolean(),
    updatedAt: z.date().nullable(),
    updatedById: z.string().nullable(),
    financerName: z
      .string()
      .min(2, "Favor ingrese el nombre del donante")
      .max(64, "Has superado el límite de caractéres (64)."),
  }),
);

export const defaultCostCategoryData: FormCostCategory = {
  id: "",
  createdAt: new Date(),
  updatedAt: null,
  createdById: "",
  updatedById: null,
  displayName: "",
  currency: "PYG",
  assignedAmount: new Prisma.Decimal(0),
  referenceExchangeRate: 7000,
  projectId: null,
};

export const defaultProjectData: FormProject = {
  id: "",
  createdAt: new Date(),
  updatedAt: null,
  createdById: "",
  updatedById: null,
  acronym: "",
  displayName: "",
  organizationId: "",
  archived: false,
  softDeleted: false,
  description: "",
  costCategories: [defaultCostCategoryData],
  endDate: null,
  projectType: "SUBSIDY",
  financerName: "",
};
