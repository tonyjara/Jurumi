import prisma from "@/server/db/client";
import { GetServerSideProps } from "next";
import BecomeMemberPage from "../pageContainers/become-member/BecomeMemberPage";
export default BecomeMemberPage;

export interface BecomeMemberPageProps {
  organizationId?: string;
}

// If there is only one organization that org's id is going to be selected automatically. If there is more than one org then it needs to be part of the query params.
// An example use case could be having 2 different webpages for two different ngo's and providing a different link for becoming a member on each org.

export const getServerSideProps: GetServerSideProps = async (context) => {
  const orgs = await prisma.organization.findMany({ select: { id: true } });

  const { organizationId } = context.query as BecomeMemberPageProps;

  const orgWithQueryId = orgs.find((org) => org.id === organizationId);

  if (
    !orgs.length ||
    !orgs[0]?.id.length ||
    (orgs.length > 1 && !orgWithQueryId)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      query: {
        organizationId:
          orgs.length > 1 && orgWithQueryId ? orgWithQueryId.id : orgs[0].id,
      },
    },
  };
};
