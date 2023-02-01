import type { Overwrite } from '@trpc/server';
import type { Session } from 'next-auth';

export type CTX = Overwrite<
  {
    session: Session | null;
  },
  {
    session: Session;
  }
>;

const notificationsStack = ({ ctx, input }: { ctx: CTX; input: any }) => {
  return {
    moneyRequest: () => console.log('moneyRequest'),
    rejectMoneyRequest: () => console.log('rejectMoneyRequest'),
  };
};
type NotificationFunction = keyof typeof notificationsStack;
export const notificationsHandler = ({
  ctx,
  input,
  functionName,
}: {
  ctx: CTX;
  input: any;
  functionName: NotificationFunction;
}) => {
  notificationsStack({ ctx, input })[functionName];
};
