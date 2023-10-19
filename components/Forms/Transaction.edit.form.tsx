import type { FormTransactionEdit } from '@/lib/validations/transaction.edit.validate';
import { VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type { FieldValues, Control, UseFormSetValue } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { formatedAccountBalance } from '../../lib/utils/TransactionUtils';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledNumberInput from '../FormControlled/FormControlledNumberInput';

import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import Decimal from 'decimal.js';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  totalAmount?: Decimal;
  setValue: UseFormSetValue<T>;
  isEditable: boolean;
}

const TransactionEditForm = ({
  control,
  errors,
  totalAmount,
  setValue,
  isEditable,
}: formProps<FormTransactionEdit>) => {
  const user = useSession().data?.user;

  const { data: moneyAccs } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  const currency = useWatch({ control, name: 'currency' });
  const wasConvertedToOtherCurrency = useWatch({
    control,
    name: 'wasConvertedToOtherCurrency',
  });
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
        disable={!isEditable}
      />
      {wasConvertedToOtherCurrency && (
        <FormControlledNumberInput
          control={control}
          errors={errors}
          name={'exchangeRate'}
          label="Tasa de cambio"
          helperText={'Un dolar equivale X guaranies'}
          disable={!isEditable}
        />
      )}

      <FormControlledMoneyInput
        control={control}
        errors={errors}
        name={'transactionAmount'}
        label="Monto"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
        totalAmount={totalAmount}
        disable={!isEditable}
      />
      <FormControlledSelect
        control={control}
        errors={errors}
        name="moneyAccountId"
        label="Seleccione un medio de extracción"
        options={moneyAccOptions ?? []}
        isClearable={true}
        disable={!isEditable}
      />

      {user && (
        <FormControlledImageUpload
          control={control}
          errors={errors}
          urlName="searchableImage.url"
          idName="searchableImage.imageName"
          label="Comprobante del desembolso"
          setValue={setValue}
          helperText="Favor tener en cuenta la orientación y legibilidad del documento."
          userId={user.id}
        />
      )}
    </VStack>
  );
};

export default TransactionEditForm;
