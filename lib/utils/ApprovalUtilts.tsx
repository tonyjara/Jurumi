import { VStack } from '@chakra-ui/react';
import type { Project } from '@playwright/test';
import type {
  MoneyRequest,
  Transaction,
  MoneyRequestApproval,
} from '@prisma/client';
import isEqual from 'lodash.isequal';
import type { Account } from 'next-auth';

type ApprovalTypes = MoneyRequest & {
  transactions: Transaction[];
  account: Account;
  organization: {
    moneyRequestApprovers: {
      id: string;
      displayName: string;
    }[];
    moneyAdministrators: {
      id: string;
      displayName: string;
    }[];
  };
  project: Project | null;
  moneyRequestApprovals: MoneyRequestApproval[];
};

export const ApprovalUtils = (
  request: ApprovalTypes | null,
  user: Omit<Account, 'password'> | undefined
) => {
  const approverIds = request?.organization.moneyRequestApprovers.map(
    (x) => x.id
  );
  const approvedIds = request?.moneyRequestApprovals.map(
    (x) => x.status === 'ACCEPTED' && x.accountId
  );
  const rejectedIds = request?.moneyRequestApprovals.map(
    (x) => x.status === 'REJECTED' && x.accountId
  );

  const hasBeenRejected = !!(
    user &&
    request?.moneyRequestApprovals.some(
      (x) => x.accountId === user.id && x.status === 'REJECTED'
    )
  );
  const needsApproval = () => {
    //1. If organization has not designated approvers, then ignore.
    if (request?.organization.moneyRequestApprovers.length) return true;
    return false;
  };
  const hasBeenApproved = () => {
    //1. If organization has not designated approvers, then ignore.
    if (request?.organization.moneyRequestApprovers.length) {
      //2. Check if the approvals contain the approvers
      if (isEqual(approvedIds, approverIds)) return true;

      return false;
    }
    return true;
  };
  const handleApprovalText = () => {
    if (request?.moneyRequestApprovals.some((x) => x.status === 'REJECTED')) {
      return `${approvedIds?.length} de ${approverIds?.length} ❌`;
    }

    return `${approvedIds?.length} de ${approverIds?.length}  ${
      hasBeenApproved() ? '✅' : '🕰️'
    }`;
  };

  const approvalText = handleApprovalText();
  const namesComponent = () => {
    return (
      <VStack alignItems={'start'}>
        {request?.organization.moneyRequestApprovers.map((x) => {
          if (approvedIds?.includes(x.id)) {
            return <span key={x.id}>✅ {x.displayName}</span>;
          }
          if (rejectedIds?.includes(x.id)) {
            return (
              <span key={x.id}>
                ❌ {x.displayName}. Rechazo:{' '}
                {
                  request.moneyRequestApprovals.find(
                    (y) => y.accountId === x.id
                  )?.rejectMessage
                }{' '}
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
