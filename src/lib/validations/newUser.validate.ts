import { z } from 'zod';

export const validateNewUser = z
  .object({
    password: z
      .string({ required_error: 'Favor ingrese una contraseña.' })
      .min(6, 'Su contraseña debe tener al menos (6) caractéres.')
      .max(129, 'Ha excedido el límite de caractéres (128).'),
    confirmPassword: z.string({
      required_error: 'Favor confirme su contraseña',
    }),
    token: z.string(),
    email: z.string(),
    linkId: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Las contraseñas no son iguales.',
        path: ['confirmPassword'],
      });
    }
  });
export type newUserForm = z.infer<typeof validateNewUser>;
export const defaultNewUserValues: newUserForm = {
  password: '',
  confirmPassword: '',
  token: '',
  email: '',
  linkId: '',
};
