import { MoneyRequestComplete } from "@/pageContainers/mod/requests/mod.requests.types";
import { VStack } from "@chakra-ui/react";
import isEqual from "lodash.isequal";
import type { Account } from "next-auth";

// if it was approved show approvers, if it is pending show based on current org approvers

export const ApprovalUtils = (
  request: MoneyRequestComplete | null,
  user: Omit<Account, "password"> | undefined
) => {
  const moneyReqApprovers = request?.moneyRequestApprovals.map((x) => x.id);
  const approverIds = request?.organization?.moneyRequestApprovers.map(
    (x) => x.id
  );
  const approvedIds = request?.moneyRequestApprovals.map(
    (x) => x.status === "ACCEPTED" && x.accountId
  );
  const rejectedIds = request?.moneyRequestApprovals.map(
    (x) => x.status === "REJECTED" && x.accountId
  );

  const hasBeenRejected = !!(
    (user &&
      request?.moneyRequestApprovals.some(
        (x) => x.accountId === user.id && x.status === "REJECTED"
      )) ||
    request?.status === "REJECTED"
  );
  const needsApproval = () => {
    //1. If organization has not designated approvers, then ignore.
    if (request?.organization.moneyRequestApprovers.length) return true;
    return false;
  };
  const hasBeenApproved = () => {
    if (request?.status === "ACCEPTED") return true;
    //1. If organization has not designated approvers, then ignore.
    if (request?.organization.moneyRequestApprovers.length) {
      //2. Check if the approvals contain the approvers
      const sortedApprovedIds = approvedIds?.sort();
      const sortedApproverIds = approverIds?.sort();
      if (isEqual(sortedApprovedIds, sortedApproverIds)) return true;

      return false;
    }
    return true;
  };
  const handleApprovalText = () => {
    //If request is approved show approvers
    if (request?.status === "ACCEPTED")
      return moneyReqApprovers?.length
        ? `${moneyReqApprovers?.length} de ${moneyReqApprovers?.length} ✅`
        : "-";

    if (request?.moneyRequestApprovals.some((x) => x.status === "REJECTED")) {
      return `${approvedIds?.length} de ${approverIds?.length} ❌`;
    }

    return `${approvedIds?.length} de ${approverIds?.length}  ${
      hasBeenApproved() ? "✅" : "🕰️"
    }`;
  };

  const approvalText = handleApprovalText();
  const namesComponent = () => {
    return (
      <VStack alignItems={"start"}>
        {request?.status === "ACCEPTED" && request.moneyRequestApprovals.length
          ? request?.moneyRequestApprovals.map((x) => {
              return <span key={x.id}>✅ {x.account.displayName}</span>;
            })
          : "-"}
        {request?.status !== "ACCEPTED" &&
          request?.organization.moneyRequestApprovers.map((x) => {
            if (approvedIds?.includes(x.id)) {
              return <span key={x.id}>✅ {x.displayName}</span>;
            }
            if (rejectedIds?.includes(x.id)) {
              return (
                <span key={x.id}>
                  ❌ {x.displayName}. Rechazo:{" "}
                  {
                    request.moneyRequestApprovals.find(
                      (y) => y.accountId === x.id
                    )?.rejectMessage
                  }{" "}
                </span>
              );
            }
            return <span key={x.id}> 🕰️ {x.displayName} </span>;
          })}
        ;
      </VStack>
    );
  };

  const approverNames = namesComponent() as React.ReactNode;

  return {
    approvalText,
    needsApproval,
    hasBeenApproved,
    approverNames,
    hasBeenRejected,
  };
};
