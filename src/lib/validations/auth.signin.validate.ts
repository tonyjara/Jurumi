import * as z from 'zod';

export const signinValidation = z.object({
  email: z
    .string({ required_error: 'Favor ingrese un correo electrónico.' })
    .email('Su correo no es válido.'),
  password: z
    .string({ required_error: 'Favor ingrese su contraseña.' })
    .min(6, 'Debe tener al menos 6 caractéres.'),
});

export type signinData = z.infer<typeof signinValidation>;
export const defaultSigninData: signinData = { email: '', password: '' };
