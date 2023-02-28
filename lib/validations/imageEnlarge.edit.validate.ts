import * as z from 'zod';

export interface FormImageEnlargeEdit {
  facturaNumber: string;
  text: string;
  id: string;
}

export const validateImageEnlargeEdit: z.ZodType<FormImageEnlargeEdit> = z.lazy(
  () =>
    z.object({
      id: z.string(),
      facturaNumber: z.string(),
      text: z.string(),
    })
);

export const defaultValidateImageEnlarge: FormImageEnlargeEdit = {
  facturaNumber: '',
  text: '',
  id: '',
};
