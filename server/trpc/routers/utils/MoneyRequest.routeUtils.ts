import type { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import prisma from "@/server/db/client";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const handleWhereImApprover = (
  input: {
    status?: "PENDING" | "ACCEPTED" | "REJECTED" | undefined;
  },
  userId: string
) => {
  if (input.status === "PENDING") {
    return {
      moneyRequestApprovals: {
        none: {
          accountId: userId,
        },
      },
    };
  }

  return {
    moneyRequestApprovals: {
      some: {
        accountId: userId,
        status: input.status,
      },
    },
  };
};

/** Add up images totals, select currency and create images when request type is reimbursement order */
export const reimbursementOrderImageGuard = async ({
  input,
}: {
  input: FormMoneyRequest;
}) => {
  if (input.moneyRequestType !== "REIMBURSMENT_ORDER") return null;

  const totalInPYG = input.searchableImages.reduce((acc, val) => {
    if (val.currency !== "PYG") return acc;
    return acc.add(val.amount);
  }, new Prisma.Decimal(0));

  const totalInUSD = input.searchableImages.reduce((acc, val) => {
    if (val.currency !== "USD") return acc;
    return acc.add(val.amount);
  }, new Prisma.Decimal(0));

  // There cannot be mixed currencies in the transaction
  input.searchableImages[0]?.currency === "PYG"
    ? (input.currency = "PYG")
    : (input.currency = "USD");
  input.searchableImages[0]?.currency === "PYG"
    ? (input.amountRequested = totalInPYG)
    : (input.amountRequested = totalInUSD);

  if (!input.searchableImages.length) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "no reimbursement proof",
    });
  }

  for (const searchableImage of input.searchableImages) {
    await prisma?.searchableImage.upsert({
      where: {
        imageName: searchableImage?.imageName,
      },
      create: {
        accountId: input.accountId,
        url: searchableImage.url,
        imageName: searchableImage.imageName,
        text: "",
        facturaNumber: searchableImage.facturaNumber ?? "",
        amount: searchableImage.amount,
      },
      update: {
        url: searchableImage.url,
        facturaNumber: searchableImage.facturaNumber ?? "",
        amount: searchableImage.amount,
      },
    });
  }

  return input.searchableImages;
};

export const handleMoneyRequestExtraFilters = ({
  extraFilters,
  getHasBeingReportedIds,
  getExecutionPendingIds,
}: {
  getHasBeingReportedIds: any;
  getExecutionPendingIds: any;
  extraFilters: string[];
}) => {
  const hasBeingReportedIds = getHasBeingReportedIds.map((r: any) => r.id);

  const executionPendingIds = getExecutionPendingIds.map((r: any) => r.id);
  const beingReportedFilter = extraFilters.includes("beingReported")
    ? { id: { in: hasBeingReportedIds } }
    : undefined;
  const pendingExecutionFilter = extraFilters.includes("pendingExecution")
    ? { id: { in: executionPendingIds } }
    : undefined;
  const removeWasCancelledFilter = extraFilters.includes("removeWasCancelled")
    ? { wasCancelled: false }
    : undefined;

  return [
    beingReportedFilter,
    pendingExecutionFilter,
    removeWasCancelledFilter,
  ];
};
export const handleHomeRequestsExtraFilters = ({
  extraFilters,
}: {
  extraFilters: string[];
}) => {
  const showWasCancelledFilter = extraFilters.includes("showCancelled")
    ? undefined
    : { wasCancelled: false };

  return [showWasCancelledFilter];
};
