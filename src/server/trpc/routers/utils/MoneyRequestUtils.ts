export const handleWhereImApprover = (
  input: {
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | undefined;
  },
  userId: string
) => {
  if (input.status === 'PENDING') {
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
