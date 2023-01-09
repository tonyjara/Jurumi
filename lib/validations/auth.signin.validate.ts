import * as z from 'zod';
import type { CustomTFunction } from '@/@types/I18n.types';

export const signinValidation = (t: CustomTFunction<'validation'>) =>
  z.object({
    email: z
      .string({ required_error: t('validation:invalidEmail') })
      .email(t('validation:invalidEmail')),
    password: z
      .string({ required_error: t('validation:requiredPassword') })
      .min(6, t('validation:minPassword')),
  });

export type FormSignin = z.infer<ReturnType<typeof signinValidation>>;
export const defaultSigninData: FormSignin = { email: '', password: '' };
