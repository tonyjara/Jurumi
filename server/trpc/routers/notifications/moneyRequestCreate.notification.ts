import type { FormMoneyRequest } from '@/lib/validations/moneyRequest.validate';
import type { CTX } from './notificationsRouter';

export const createMoneyRequestNotification = ({
  ctx,
  input,
}: {
  ctx: CTX;
  input: FormMoneyRequest;
}) => {};
