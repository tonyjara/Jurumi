import type { FormOrganization } from "@/lib/validations/org.validate";
import prisma from "@/server/db/client";

export const createImageLogo = async ({
  input,
  accountId,
}: {
  input: FormOrganization;
  accountId: string;
}) => {
  if (!input.imageLogo) {
    return null;
  }
  const imageLogo = await prisma?.searchableImage.upsert({
    where: {
      imageName: input.imageLogo?.imageName,
    },
    create: {
      accountId: accountId,
      url: input.imageLogo.url,
      imageName: input.imageLogo.imageName,
      text: "",
    },
    update: {},
  });

  return imageLogo;
};
