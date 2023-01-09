import { z } from 'zod';

export const validateInitialSetup = z
  .object({
    displayName: z.string().min(3, 'Favor ingrese un nombre.'),
    email: z.string().email('Favor ingrese un correo válido.'),
    password: z
      .string({ required_error: 'Favor ingrese una contraseña.' })
      .min(6, 'Su contraseña debe tener al menos (6) caractéres.')
      .max(129, 'Ha excedido el límite de caractéres (128).'),
    confirmPassword: z.string({
      required_error: 'Favor confirme su contraseña',
    }),
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
export type FormInitialSetup = z.infer<typeof validateInitialSetup>;
export const defaultInitialSetupData: FormInitialSetup = {
  password: '',
  confirmPassword: '',
  email: '',
  displayName: '',
};
