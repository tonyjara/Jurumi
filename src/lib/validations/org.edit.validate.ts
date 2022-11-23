import * as z from 'zod';

export const validateOrgEdit = z.object({
  id: z.string(),
  updatedById: z.string().nullish(),
  displayName: z
    .string({ required_error: 'Favor ingrese un nombre para su org.' })
    .max(64, { message: 'Has excedido el límite de caractéres (64)' })
    .min(3, { message: 'El nombre debe tener al menos caractéres (64)' }),
});
