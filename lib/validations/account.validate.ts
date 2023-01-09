import type { Account, AccountVerificationLinks } from '@prisma/client';
import { Role } from '@prisma/client';
import * as z from 'zod';

export type FormAccount = Omit<Account, 'password'>;

export const validateAccount: z.ZodType<FormAccount> = z.lazy(() =>
  z.object({
    id: z.string(),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    displayName: z
      .string({ required_error: 'Favor ingrese un nombre para el usuario.' })
      .max(64, { message: 'Has excedido el límite de caractéres (64)' })
      .min(3, { message: 'El nombre debe tener al menos caractéres (64)' }),
    email: z
      .string()
      .email('Favor ingrese un correo válido.')
      .max(128, { message: 'Has excedido el límite de caractéres (128)' }),

    role: z.nativeEnum(Role),
    isVerified: z.boolean(),
  })
);

export const defaultAccountData: FormAccount = {
  id: '',
  active: true,
  createdAt: new Date(),
  updatedAt: null,
  email: '',
  displayName: '',
  role: 'USER',
  isVerified: false,
};

export interface accountWithVerifyLink extends Account {
  accountVerificationLinks: AccountVerificationLinks[];
}
