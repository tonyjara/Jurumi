import { VStack } from '@chakra-ui/react';
import type { Transaction } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { formatedAccountBalance } from '../../lib/utils/TransactionUtils';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';

import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  totalAmount?: Decimal;
}

const TransactionEditForm = ({
  control,
  errors,
  totalAmount,
}: formProps<Transaction>) => {
  const { data: moneyAccs } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  const currency = useWatch({ control, name: 'currency' });

  const moneyAccOptions = moneyAccs
    ?.filter((x) => x.currency === currency)
    .map((acc) => ({
      value: acc.id,
      label: `${acc.displayName} ${formatedAccountBalance(acc)}`,
    }));

  return (
    <VStack spacing={5}>
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="currency"
        label="Moneda"
        options={currencyOptions}
      />
      <FormControlledSelect
        control={control}
        errors={errors}
        name="moneyAccountId"
        label="Seleccione un medio de extracción"
        options={moneyAccOptions ?? []}
        isClearable={true}
      />
      <FormControlledMoneyInput
        control={control}
        errors={errors}
        name={'transactionAmount'}
        label="Monto"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
        totalAmount={totalAmount}
      />
    </VStack>
  );
};

export default TransactionEditForm;
