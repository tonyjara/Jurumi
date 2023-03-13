import { faker } from '@faker-js/faker';
import type { MoneyRequest, TaxPayerBankInfo } from '@prisma/client';
import { BankAccountType } from '@prisma/client';
import { BankDocType, BankNamesPy } from '@prisma/client';
import { MoneyRequestStatus, MoneyRequestType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';
import { stringReqMinMax } from '../utils/ValidationHelpers';
import { v4 as uuidV4 } from 'uuid';

export type moneyReqTaxPayer = {
  razonSocial: string;
  ruc: string;
  bankInfo: TaxPayerBankInfo;
};

export type FormMoneyRequest = Omit<
  MoneyRequest,
  'amountRequested' | 'taxPayerId'
> & {
  amountRequested?: any;
  taxPayer: moneyReqTaxPayer | null;
  searchableImage: { imageName: string; url: string } | null;
};

export const validateMoneyRequest: z.ZodType<FormMoneyRequest> = z.lazy(() =>
  z
    .object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      description: stringReqMinMax(
        'Favor ingrese el concepto del desembolso.',
        6,
        128
      ),
      status: z.nativeEnum(MoneyRequestStatus),
      moneyRequestType: z.nativeEnum(MoneyRequestType),
      currency: z.nativeEnum(Currency),
      amountRequested: z.any().transform((value) => new Prisma.Decimal(value)),
      accountId: z.string(),
      comments: z
        .string()
        .max(256, 'Has excedido el límite de caractéres (256)'),
      projectId: z.string().nullable(),
      costCategoryId: z.string().nullable(),
      archived: z.boolean(),
      softDeleted: z.boolean(),
      rejectionMessage: z.string(),
      organizationId: z.string().min(1, 'Favor seleccione una organización.'),
      wasCancelled: z.boolean(),
      taxPayer: z
        .object({
          razonSocial: z.string({
            required_error: 'Favor ingrese el documento del contribuyente.',
          }),
          ruc: z.string({
            required_error: 'Favor ingrese el documento del contribuyente.',
          }),
          bankInfo: z.object({
            bankName: z.nativeEnum(BankNamesPy),
            accountNumber: z.string(),
            ownerName: z.string(),
            ownerDocType: z.nativeEnum(BankDocType),
            ownerDoc: z.string(),
            taxPayerId: z.string(),
            type: z.nativeEnum(BankAccountType),
          }),
        })
        .nullable(),
      // For reimbursement order creation.
      facturaNumber: z.string().nullable(),
      searchableImage: z
        .object({
          imageName: z.string(),
          url: z.string(),
        })
        .nullable(),
    })
    .superRefine((val, ctx) => {
      if (val.status === 'REJECTED' && val.rejectionMessage.length < 6) {
        ctx.addIssue({
          path: ['rejectionMessage'],
          code: z.ZodIssueCode.custom,
          message: 'Favor justifique el rechazo en al menos 6 caractéres.',
        });
      }
      //Require taxPayer and bank info
      if (val.moneyRequestType !== 'FUND_REQUEST') {
        if (
          !val.taxPayer ||
          !val.taxPayer.razonSocial?.length ||
          !val.taxPayer.ruc.length
        ) {
          ctx.addIssue({
            path: ['taxPayer.ruc'],
            code: z.ZodIssueCode.custom,
            message: 'Favor ingrese los datos del beneficiario.',
          });
        }

        if (
          !val.taxPayer?.bankInfo.accountNumber.length ||
          val.taxPayer.bankInfo.accountNumber.length < 3
        ) {
          ctx.addIssue({
            path: ['taxPayer.bankInfo.accountNumber'],
            code: z.ZodIssueCode.custom,
            message: 'Favor ingrese el número de la cuenta bancaria.',
          });
        }
        if (
          !val.taxPayer?.bankInfo.ownerName.length ||
          val.taxPayer.bankInfo.ownerName.length < 3
        ) {
          ctx.addIssue({
            path: ['taxPayer.bankInfo.ownerName'],
            code: z.ZodIssueCode.custom,
            message: 'Favor ingrese la denominación.',
          });
        }
        if (
          !val.taxPayer?.bankInfo.ownerDoc.length ||
          val.taxPayer.bankInfo.ownerDoc.length < 3
        ) {
          ctx.addIssue({
            path: ['taxPayer.bankInfo.ownerDoc'],
            code: z.ZodIssueCode.custom,
            message: 'Favor ingrese el documento del titular.',
          });
        }
      }
      if (
        val.moneyRequestType === 'REIMBURSMENT_ORDER' &&
        !val.facturaNumber?.length
      ) {
        ctx.addIssue({
          path: ['facturaNumber'],
          code: z.ZodIssueCode.custom,
          message: 'Favor ingrese el número de factura.',
        });
      }
      if (
        val.moneyRequestType === 'REIMBURSMENT_ORDER' &&
        !val.searchableImage?.imageName?.length
      ) {
        ctx.addIssue({
          path: ['searchableImage.imageName'],
          code: z.ZodIssueCode.custom,
          message: 'Favor suba una foto de su comprobante.',
        });
      }
      if (val.amountRequested.toNumber() <= 1) {
        ctx.addIssue({
          path: ['amountRequested'],
          code: z.ZodIssueCode.custom,
          message: 'El monto debe ser mayor a 1.',
        });
      }
    })
);

export const defaultMoneyRequestData: FormMoneyRequest = {
  id: '',
  comments: '',
  createdAt: new Date(),
  updatedAt: null,
  description: '',
  status: 'PENDING',
  moneyRequestType: 'FUND_REQUEST',
  currency: 'PYG',
  amountRequested: new Prisma.Decimal(0),
  costCategoryId: null,
  accountId: '',
  projectId: null,
  archived: false,
  softDeleted: false,
  rejectionMessage: '',
  organizationId: '',
  wasCancelled: false,
  taxPayer: {
    razonSocial: '',
    ruc: '',
    bankInfo: {
      bankName: 'BANCOP',
      accountNumber: '',
      ownerName: '',
      ownerDocType: 'CI',
      ownerDoc: '',
      taxPayerId: '',
      type: 'SAVINGS',
    },
  },
  facturaNumber: null,
  searchableImage: { url: '', imageName: '' },
};

export const moneyRequestMock = ({
  organizationId,
  moneyRequestType,
}: {
  organizationId: string;
  moneyRequestType: MoneyRequestType;
}) => {
  const imageName = uuidV4();
  const x: FormMoneyRequest = {
    id: '',
    comments: faker.commerce.productDescription().substring(0, 200),
    createdAt: new Date(),
    updatedAt: null,
    description: faker.commerce.productDescription().substring(0, 123),
    status: 'PENDING',
    moneyRequestType,
    currency: 'PYG',
    amountRequested: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    accountId: '',
    costCategoryId: null,
    projectId: null,
    archived: false,
    softDeleted: false,
    rejectionMessage: '',
    wasCancelled: false,
    organizationId,
    taxPayer: {
      razonSocial: faker.company.name(),
      ruc: faker.random.numeric(6),
      bankInfo: {
        bankName: 'BANCOP',
        accountNumber: faker.random.numeric(6),
        ownerName: faker.name.fullName(),
        ownerDocType: 'CI',
        ownerDoc: faker.random.numeric(6),
        taxPayerId: '',
        type: 'SAVINGS',
      },
    },
    facturaNumber: faker.random.numeric(13).toString(),
    searchableImage: {
      url: 'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa',
      imageName,
    },
  };
  return x;
};
