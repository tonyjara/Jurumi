import { z } from 'zod';

export const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

export const stringMinMax = (min: number, max: number) =>
  z
    .string()
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);
