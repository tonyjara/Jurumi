import { adminModObserverProcedure, adminProcedure, router } from "../initTrpc";
import prisma from "@/server/db/client";
import { z } from "zod";
import axios from "axios";
import { validateReplaceImageFormData } from "@/components/AdminUtils/ReplaceSearchableImage";

export const galleryRouter = router({
  getManyImages: adminModObserverProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        facturaNumber: z.string(),
      })
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma.searchableImage.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: { createdAt: "desc" },
        where:
          input.facturaNumber.length > 0
            ? { facturaNumber: { startsWith: input.facturaNumber } }
            : undefined,
      });
    }),
  count: adminModObserverProcedure.query(async () => {
    return await prisma.searchableImage.count();
  }),
  scanImage: adminModObserverProcedure
    .input(z.object({ imageName: z.string() }))
    .mutation(async ({ input }) => {
      await axios.post(`${process.env.MS_OCR_URL}/api/process-image`, input, {
        headers: { "x-api-key": process.env.MS_API_KEY },
      });
    }),
  replaceImageUrl: adminProcedure
    .input(validateReplaceImageFormData)
    .mutation(async ({ input }) => {
      return await prisma.searchableImage.update({
        where: { imageName: input.oldImageName },
        data: {
          url: input.url,
          imageName: input.newImageName,
          accountId: input.userId,
        },
      });
    }),
});
