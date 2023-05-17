import {
  adminModObserverProcedure,
  adminModProcedure,
  publicProcedure,
  router,
} from "../initTrpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/server/db/client";
import { validateMember } from "@/lib/validations/member.validate";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
import { validateBecomeMemberRequest } from "@/lib/validations/becomeMember.validate";

export const membersRouter = router({
  count: adminModObserverProcedure.query(async () => {
    return await prisma?.membership.count();
  }),
  getMany: adminModObserverProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      })
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma.membership.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        include: { account: true },
      });
    }),
  createMemberRequest: publicProcedure
    .input(validateBecomeMemberRequest)
    .mutation(async ({ input: i }) => {
      // Reject if preferences not set

      const req = await prisma.becomeMemberRequest.create({
        data: {
          fullName: i.fullName,
          documentId: i.documentId,
          phoneNumber: i.phoneNumber,
          email: i.email,
          birthDate: i.birthDate,
          nationality: i.nationality,
          address: i.address,
          occupation: i.occupation,
          status: "PENDING",
          organizationId: i.organizationId,
        },
      });

      // Send email to consejo

      // Send confirmation email to user

      return req;
    }),
  create: adminModProcedure
    .input(validateMember)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const orgId = await (
        await prisma.preferences.findUniqueOrThrow({
          where: { accountId: user.id },
        })
      ).selectedOrganization;
      const userWithSameEmail = await prisma.account.findUnique({
        where: { email: input.email },
        include: { membership: true },
      });

      if (userWithSameEmail?.membership) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Membership already exists",
        });
      }

      if (userWithSameEmail) {
        // append membership to existing account
        await prisma.account.update({
          where: { id: userWithSameEmail.id },
          data: {
            membership: {
              create: {
                active: true,
                memberSince: input.memberSince,
                expirationDate: input.expirationDate,
                initialBalance: input.initialBalance,
                currency: "PYG",
                memberType: input.memberType,
              },
            },
          },
        });
      }

      if (!userWithSameEmail) {
        await prisma.account.create({
          data: {
            displayName: input.displayName,
            role: "MEMBER",
            email: input.email,
            isVerified: false,
            active: true,
            password: "",
            preferences: { create: { selectedOrganization: orgId } },
            membership: {
              create: {
                active: true,
                memberSince: input.memberSince,
                expirationDate: input.expirationDate,
                initialBalance: input.initialBalance,
                currency: "PYG",
                memberType: input.memberType,
              },
            },
            organizations: { connect: { id: orgId } },
          },
        });
      }
    }),
});
