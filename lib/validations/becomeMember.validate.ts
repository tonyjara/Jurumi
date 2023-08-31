//@ts-ignore
const faker = (await import("@faker-js/faker")).faker;
import type { BecomeMemberRequest } from "@prisma/client";
import * as z from "zod";

export const validateBecomeMemberRequest: z.ZodType<BecomeMemberRequest> =
  z.lazy(() =>
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      fullName: z
        .string({ required_error: "Favor ingrese su nombre completo" })
        .max(64, { message: "Has excedido el límite de caractéres (64)" })
        .min(2, { message: "Su nombre debe tener al menos (2) caractéres" }),
      documentId: z
        .string()
        .min(4, "Su documento debe tener al menos 4 caractéres.")
        .max(20, { message: "Has excedido el límite de caractéres (20)" }),
      phoneNumber: z
        .string()
        .min(10, "Su número de teléfono debe tener al menos 8 caractéres.")
        .max(20, { message: "Has excedido el límite de caractéres (20)" }),
      email: z
        .string()
        .email("Favor ingrese un correo válido.")
        .max(128, { message: "Has excedido el límite de caractéres (128)" }),
      birthDate: z.date({
        required_error: "Favor ingrese su fecha de nacimiento",
      }),
      nationality: z
        .string()
        .min(2, {
          message: "Su nacionalidad debe tener al menos (2) caractéres",
        })
        .max(64, "Has excedido el límite de caractéres (64)."),
      address: z
        .string()
        .min(10, "Su dirección debe tener al menos 10 caractéres.")
        .max(128, { message: "Has excedido el límite de caractéres (128)" }),
      occupation: z.string(),
      status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
      organizationId: z.string(),
    })
  );

export type FormBecomeMemberRequest = z.infer<
  typeof validateBecomeMemberRequest
>;
export const defaultBecomeMemberRequestData: (
  organizationId: string
) => FormBecomeMemberRequest = (organizationId) => {
  return {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: "",
    documentId: "",
    phoneNumber: "",
    email: "",
    birthDate: new Date(),
    nationality: "",
    address: "",
    occupation: "",
    status: "PENDING",
    organizationId,
  };
};
export const mockBecomeMemberRequest: (
  organizationId: string
) => FormBecomeMemberRequest = (organizationId) => {
  return {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: faker.name.fullName(),
    documentId: faker.datatype.number({ min: 100000, max: 999999 }).toString(),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    birthDate: faker.date.past(),
    nationality: faker.address.country(),
    address: faker.address.streetAddress(),
    occupation: faker.name.jobTitle(),
    status: "PENDING",
    organizationId: organizationId,
  };
};
