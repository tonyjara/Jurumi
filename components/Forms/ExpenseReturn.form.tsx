import { VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
  UseFormReset,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import { reduceExpenseReports } from '@/lib/utils/TransactionUtils';
import type { CompleteMoneyReqHome } from '@/pageContainers/home/requests/HomeRequestsPage.home.requests';
import type { FormExpenseReturn } from '@/lib/validations/expenseReturn.validate';
import type { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { expenseReturnMock } from '@/__tests__/mocks/Mocks';
import SeedButton from '../DevTools/SeedButton';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  moneyRequest?: CompleteMoneyReqHome;
  reset: UseFormReset<FormExpenseReturn>;
}

const ExpenseReturnForm = ({
  control,
  errors,
  moneyRequest,
  setValue,
  reset,
}: formProps<FormExpenseReturn>) => {
  const { data: session } = useSession();
  const user = session?.user;

  const currency = useWatch({ control, name: 'currency' });

  const { data: moneyAccs } = trpcClient.moneyAcc.getManyPublic.useQuery();

  const moneyAccOptions = (currency: Currency) =>
    moneyAccs
      ?.filter((x) => x.currency === currency)
      .map((acc) => ({
        value: acc.id,
        label: `${acc.displayName}`,
      }));

  const pendingAmount = () =>
    moneyRequest
      ? moneyRequest.amountRequested.sub(
          reduceExpenseReports(moneyRequest.expenseReports)
        )
      : new Prisma.Decimal(0);
  const accOptions = moneyAccOptions(currency);
  return (
    <VStack spacing={5}>
      {accOptions && accOptions[0]?.value && moneyRequest && (
        <SeedButton
          reset={reset}
          mock={() =>
            expenseReturnMock({
              moneyRequestId: moneyRequest.id,
              moneyAccountId: accOptions[0]?.value ?? '',
              amountReturned: pendingAmount(),
            })
          }
        />
      )}
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="currency"
        label="Moneda"
        options={currencyOptions}
      />
      <FormControlledMoneyInput
        control={control}
        errors={errors}
        name={'amountReturned'}
        label="Monto devuelto"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
        totalAmount={
          moneyRequest &&
          moneyRequest.amountRequested.sub(
            reduceExpenseReports(moneyRequest.expenseReports)
          )
        }
      />

      {user && (
        <FormControlledImageUpload
          control={control}
          errors={errors}
          urlName="searchableImage.url"
          idName="searchableImage.imageName"
          label="Foto de su comprobante de devolución"
          setValue={setValue}
          userId={user.id}
          helperText="Favor tener en cuenta la orientación y legibilidad del documento."
        />
      )}

      <FormControlledSelect
        control={control}
        errors={errors}
        name={'moneyAccountId'}
        label="Seleccione la cuenta que recibió la devolución"
        options={moneyAccOptions(currency) ?? []}
        isClearable={true}
      />
    </VStack>
  );
};

export default ExpenseReturnForm;
