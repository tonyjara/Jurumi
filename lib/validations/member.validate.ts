import { faker } from '@faker-js/faker';
import type { Account, Membership } from '@prisma/client';
import { MemberType } from '@prisma/client';
import { Currency, Prisma } from '@prisma/client';
import { Role } from '@prisma/client';
import * as z from 'zod';

export type FormMember = Omit<
  Account,
  | 'id'
  | 'active'
  | 'createdAt'
  | 'updatedAt'
  | 'softDeleted'
  | 'archived'
  | 'password'
  | 'isVerified'
> &
  Omit<
    Membership,
    | 'id'
    | 'active'
    | 'createdAt'
    | 'updatedAt'
    | 'softDeleted'
    | 'archived'
    | 'initialBalance'
    | 'accountId'
  > & { initialBalance?: any };

export const validateAccount: z.ZodType<FormMember> = z.lazy(() =>
  z.object({
    displayName: z
      .string({ required_error: 'Favor ingrese un nombre para el usuario.' })
      .max(64, { message: 'Has excedido el límite de caractéres (64)' })
      .min(3, { message: 'El nombre debe tener al menos caractéres (64)' }),
    email: z
      .string()
      .email('Favor ingrese un correo válido.')
      .max(128, { message: 'Has excedido el límite de caractéres (128)' }),

    role: z.nativeEnum(Role),
    initialBalance: z.any().transform((value) => new Prisma.Decimal(value)),
    memberSince: z.date(),
    expirationDate: z.date(),
    currency: z.nativeEnum(Currency),
    memberType: z.nativeEnum(MemberType),
  })
);

export const defaultMemberData: FormMember = {
  email: '',
  displayName: '',
  role: 'MEMBER',
  initialBalance: new Prisma.Decimal(0),
  memberSince: new Date(),
  memberType: 'REGULAR',
  currency: 'PYG',
  expirationDate: new Date(),
};
export const mockFormMember: FormMember = {
  email: faker.internet.email(),
  displayName: faker.name.fullName(),
  role: 'MEMBER',
  initialBalance: new Prisma.Decimal(faker.commerce.price(100000, 300000)),
  memberSince: faker.date.past(2),
  memberType: 'REGULAR',
  currency: 'PYG',
  expirationDate: faker.date.future(1),
};
