//@ts-ignore
const faker = (await import("@faker-js/faker")).faker;
import type { Account, Membership } from "@prisma/client";
import { MemberType } from "@prisma/client";
import { Currency, Prisma } from "@prisma/client";
import * as z from "zod";

export type FormMember = Omit<
  Account,
  | "id"
  | "active"
  | "createdAt"
  | "updatedAt"
  | "softDeleted"
  | "archived"
  | "password"
  | "isVerified"
  | "role"
> &
  Omit<
    Membership,
    | "id"
    | "active"
    | "createdAt"
    | "updatedAt"
    | "softDeleted"
    | "archived"
    | "initialBalance"
    | "accountId"
  > & { initialBalance?: any };

export const validateMember: z.ZodType<FormMember> = z.lazy(() =>
  z.object({
    displayName: z
      .string({ required_error: "Favor ingrese un nombre para el usuario." })
      .max(64, { message: "Has excedido el límite de caractéres (64)" })
      .min(2, { message: "El nombre debe tener al menos (2) caractéres" }),
    email: z
      .string()
      .email("Favor ingrese un correo válido.")
      .max(128, { message: "Has excedido el límite de caractéres (128)" }),

    initialBalance: z.any().transform((value) => new Prisma.Decimal(value)),
    memberSince: z.date(),
    expirationDate: z.date(),
    currency: z.nativeEnum(Currency),
    memberType: z.nativeEnum(MemberType),
  }),
);

export const defaultMemberData: FormMember = {
  email: "",
  displayName: "",
  initialBalance: new Prisma.Decimal(0),
  memberSince: new Date(),
  memberType: "REGULAR",
  currency: "PYG",
  expirationDate: new Date(),
};
export const mockFormMember: FormMember = {
  email: faker.internet.email(),
  displayName: faker.person.fullName(),
  initialBalance: new Prisma.Decimal(
    faker.commerce.price({ min: 100000, max: 300000 }),
  ),
  memberSince: faker.date.past({ years: 2 }),
  memberType: "REGULAR",
  currency: "PYG",
  expirationDate: faker.date.future({ years: 2 }),
};
