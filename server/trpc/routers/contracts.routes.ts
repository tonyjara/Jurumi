import {
  adminModObserverProcedure,
  adminModProcedure,
  adminProcedure,
  router,
} from "../initTrpc";
import { z } from "zod";
import prisma from "@/server/db/client";
import {
  FormContract,
  validateContract,
} from "@/lib/validations/createContract.validate";
import { TRPCError } from "@trpc/server";
import { getManyContractsArgs } from "@/pageContainers/mod/contracts/Contract.types";

export const contractsRouter = router({
  getManyWithLast6Requests: adminModObserverProcedure.query(async () => {
    return await prisma.contracts.findMany({
      where: {
        softDeleted: false,
        archived: false,
        wasCancelled: false,
      },
      ...getManyContractsArgs,
    });
  }),
  getContractCategories: adminModObserverProcedure.query(async () => {
    return await prisma.contratCategories.findMany();
  }),
  createContractCategory: adminModProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await prisma.contratCategories.create({
        data: {
          name: input.name,
        },
      });
    }),
  create: adminModProcedure
    .input(validateContract)
    .mutation(async ({ input }) => {
      const formContract: Omit<FormContract, "payments" | "id"> = {
        amount: input.amount,
        accountId: input.accountId,
        contratCategoriesId: input.contratCategoriesId,
        costCategoryId: input.costCategoryId,
        currency: input.currency,
        description: input.description,
        endDate: input.endDate,
        frequency: input.frequency,
        moneyRequestType: input.moneyRequestType,
        name: input.name,
        projectId: input.projectId,
        remindDaysBefore: input.remindDaysBefore,
        contractUrl: input.contractUrl,
        paymentDate: input.paymentDate,
        monthlyPaymentDay: input.monthlyPaymentDay,
        weeklyPaymentDay: input.weeklyPaymentDay,
        yearlyPaymentDate: input.yearlyPaymentDate,
      };

      //Only when it's a variable contract add payments
      return await prisma.contracts.create({
        data: {
          ...formContract,
          payments:
            formContract.frequency === "VARIABLE"
              ? {
                  createMany: {
                    //Done to omit the ID
                    data: input.payments.map((payment) => ({
                      name: payment.name,
                      amount: payment.amount,
                      currency: payment.currency,
                      dateDue: payment.dateDue,
                    })),
                  },
                }
              : undefined,
        },
      });
    }),
  connectRequests: adminModProcedure
    .input(
      z.object({ contractId: z.number(), moneyRequestIds: z.string().min(1) }),
    )
    .mutation(async ({ input }) => {
      //If the string has a comma, it means that there are multiple requests
      const requestIds = input.moneyRequestIds.includes(",")
        ? input.moneyRequestIds.split(",").flatMap((id) => {
            return id.length ? { id } : [];
          })
        : [{ id: input.moneyRequestIds }];

      const findRequests = await prisma.moneyRequest.findMany({
        where: {
          id: {
            in: requestIds.map((request) => request.id),
          },
        },
      });

      if (findRequests.length !== requestIds.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Alguna de las solicitudes no existe",
        });
      }

      return await prisma.contracts.update({
        where: {
          id: input.contractId,
        },
        data: {
          moneyRequests: {
            connect: [...requestIds],
          },
        },
      });
    }),

  edit: adminModProcedure
    .input(validateContract)
    .mutation(async ({ input }) => {
      const formContract: Omit<FormContract, "payments" | "id"> = {
        amount: input.amount,
        accountId: input.accountId,
        contratCategoriesId: input.contratCategoriesId,
        costCategoryId: input.costCategoryId,
        currency: input.currency,
        description: input.description,
        endDate: input.endDate,
        frequency: input.frequency,
        moneyRequestType: input.moneyRequestType,
        name: input.name,
        projectId: input.projectId,
        remindDaysBefore: input.remindDaysBefore,
        contractUrl: input.contractUrl,
        paymentDate: input.paymentDate,
        monthlyPaymentDay: input.monthlyPaymentDay,
        weeklyPaymentDay: input.weeklyPaymentDay,
        yearlyPaymentDate: input.yearlyPaymentDate,
      };
      if (input.frequency === "VARIABLE") {
        //Get all payments from the contract
        const payments = await prisma.contractPayments.findMany({
          where: {
            contractsId: input.id,
          },
        });
        //Delete all payments that are not in the new input
        const paymentsToDelete = payments.filter(
          (payment) =>
            !input.payments.find((newPayment) => newPayment.id === payment.id),
        );
        await prisma.contractPayments.deleteMany({
          where: {
            id: {
              in: paymentsToDelete.map((payment) => payment.id),
            },
          },
        });
        //Update all payments that are in the new input
        const paymentsToUpdate = payments.filter((payment) =>
          input.payments.find((newPayment) => newPayment.id === payment.id),
        );

        await Promise.all(
          paymentsToUpdate.map(async (payment) => {
            const newPayment = input.payments.find(
              (newPayment) => newPayment.id === payment.id,
            );
            if (newPayment) {
              await prisma.contractPayments.update({
                where: {
                  id: payment.id,
                },
                data: {
                  name: newPayment.name,
                  amount: newPayment.amount,
                  currency: newPayment.currency,
                  dateDue: newPayment.dateDue,
                },
              });
            }
          }),
        );
        //Create all payments that are not in the old input
        const paymentsToCreate = input.payments.filter(
          (payment) =>
            !payments.find((oldPayment) => oldPayment.id === payment.id),
        );
        await prisma.contractPayments.createMany({
          data: paymentsToCreate.map((payment) => ({
            name: payment.name,
            amount: payment.amount,
            currency: payment.currency,
            dateDue: payment.dateDue,
            contractsId: input.id,
          })),
        });
      }

      //Only when it's a variable contract add payments
      return await prisma.contracts.update({
        where: {
          id: input.id,
        },
        data: {
          ...formContract,
        },
      });
    }),
  deleteCategoryContract: adminModProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const contractsWithCategory = await prisma.contracts.findFirst({
        where: {
          contratCategoriesId: input.id,
        },
      });
      if (contractsWithCategory) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "La categoría no puede ser eliminada porque tiene contratos asociados",
        });
      }

      return await prisma.contratCategories.delete({
        where: {
          id: input.id,
        },
      });
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.contracts.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
