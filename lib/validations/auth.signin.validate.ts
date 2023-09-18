import * as z from "zod";

export const signinValidation = z.object({
  email: z
    .string({ required_error: "Favor ingrese un correo" })
    .email("Su correo no es valido"),
  password: z
    .string({ required_error: "Favor ingrese una contraseña" })
    .min(6, "Su contraseña debe tener al menos 6 caracteres"),
});

export type FormSignin = z.infer<typeof signinValidation>;
export const defaultSigninData: FormSignin = { email: "", password: "" };
