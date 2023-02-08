import * as z from 'zod';

export type FormAccountProfile = {
  id: string;
  email: string;
  displayName: string;
  preferences: {
    receiveEmailNotifications: boolean;
  } | null;
  profile: {
    avatarUrl: string;
  } | null;
};

export const validateAccountProfile: z.ZodType<FormAccountProfile> = z.lazy(
  () =>
    z.object({
      id: z.string(),
      displayName: z
        .string()
        .min(2, 'Su nombre debe tener al menos 2 caractéres.'),
      email: z.string().email('Su correo es inválido.'),
      profile: z
        .object({
          avatarUrl: z
            .string()
            .min(1, 'Favor suba la imágen de su comprobante'),
        })
        .nullable(),
      preferences: z
        .object({
          receiveEmailNotifications: z.boolean(),
        })
        .nullable(),
    })
);

export const defaultAccountProfileData: FormAccountProfile = {
  id: '',
  displayName: '',
  email: '',
  profile: { avatarUrl: '' },
  preferences: { receiveEmailNotifications: true },
};
