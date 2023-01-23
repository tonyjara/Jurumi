import { currencyOptions } from '@/lib/utils/SelectOptions';
import { formatedAccountBalance } from '@/lib/utils/TransactionUtils';
import { translateCurrencyPrefix } from '@/lib/utils/TranslatedEnums';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormImbursement } from '@/lib/validations/imbursement.validate';
import { imbursementMock } from '@/__tests__/mocks/Mocks';
import { Button, Divider, Text, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  UseFormSetValue,
  UseFormReset,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import SeedButton from '../DevTools/SeedButton';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledNumberInput from '../FormControlled/FormControlledNumberInput';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledSwitch from '../FormControlled/FormControlledSwitch';
import FormControlledTaxPayerId from '../FormControlled/FormControlledTaxPayerId';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  setValue: UseFormSetValue<T>;
  isEditForm?: boolean;
  reset: UseFormReset<T>;
}

const ImbursementForm = ({
  control,
  errors,
  setValue,
  isEditForm,
  reset,
}: formProps<FormImbursement>) => {
  const { data: session } = useSession();
  const user = session?.user;
  const otherCurrency = useWatch({ control, name: 'otherCurrency' });
  const finalCurrency = useWatch({ control, name: 'finalCurrency' });
  const amountInOtherCurrency = useWatch({
    control,
    name: 'amountInOtherCurrency',
  });
  const exchangeRate = useWatch({ control, name: 'exchangeRate' });
  const wasConvertedToOtherCurrency = useWatch({
    control,
    name: 'wasConvertedToOtherCurrency',
  });

  const handleConvert = () => {
    setValue('finalAmount', amountInOtherCurrency * exchangeRate);
  };

  //Data getters

  const { data: projects } = trpcClient.project.getMany.useQuery();
  const { data: moneyAccs } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  // Options for select

  // If it was not converted to another currency, then only take account in the initial currency otherwhise take accounts in the final currency
  const moneyAccOptions = moneyAccs
    ?.filter(
      (x) =>
        x.currency ===
        (wasConvertedToOtherCurrency ? finalCurrency : otherCurrency)
    )
    .map((acc) => ({
      value: acc.id,
      label: `${acc.displayName} ${formatedAccountBalance(acc)}`,
    }));

  return (
    <>
      <SeedButton
        reset={reset}
        mock={() => imbursementMock(moneyAccOptions, projectOptions)}
      />
      <VStack spacing={5}>
        {isEditForm && (
          <Text fontSize={'sm'} color={'red.500'}>
            Algunos campos no pueden editarse, en caso que necesite modificarlos
            favor anular el desembolso y crear uno nuevo.
          </Text>
        )}
        <FormControlledText
          control={control}
          errors={errors}
          name="concept"
          isTextArea={true}
          label="Concepto del desembolso"
        />
        <FormControlledRadioButtons
          control={control}
          errors={errors}
          name="otherCurrency"
          label="Moneda recibida"
          options={currencyOptions}
          disable={isEditForm}
          //resets money account on change
          onChangeMw={() => setValue('moneyAccountId', null)}
        />
        <FormControlledMoneyInput
          control={control}
          errors={errors}
          name="amountInOtherCurrency"
          label="Monto recibido"
          prefix={translateCurrencyPrefix(otherCurrency)}
          currency={otherCurrency}
          disable={isEditForm}
        />
        <FormControlledSwitch
          control={control}
          errors={errors}
          name="wasConvertedToOtherCurrency"
          label="Convertir a otra moneda:  No - Si"
          disable={isEditForm}
        />

        {wasConvertedToOtherCurrency && (
          <>
            <FormControlledNumberInput
              control={control}
              errors={errors}
              name="exchangeRate"
              label="Tasa de cambio"
              helperText={`Un ${translateCurrencyPrefix(
                otherCurrency
              )} es igual a tantos ${translateCurrencyPrefix(finalCurrency)}`}
              disable={isEditForm}
            />
            <FormControlledRadioButtons
              control={control}
              errors={errors}
              name="finalCurrency"
              label="Convertir a:"
              options={currencyOptions}
              disable={isEditForm}
              //resets money account on change
              onChangeMw={() => setValue('moneyAccountId', null)}
            />
            <FormControlledMoneyInput
              control={control}
              errors={errors}
              name="finalAmount"
              label="Monto convertido"
              prefix={translateCurrencyPrefix(finalCurrency)}
              currency={finalCurrency}
              helperText={
                'Ingresar manualmente o presiona el botón para convertir.'
              }
              disable={isEditForm}
            />
            <Button isDisabled={isEditForm} onClick={handleConvert}>
              Convertir
            </Button>
          </>
        )}
        <Divider />
        <FormControlledSelect
          control={control}
          errors={errors}
          name={'moneyAccountId'}
          label="Seleccione una cuenta para recibir el fondo."
          options={moneyAccOptions ?? []}
          isClearable={true}
          disable={isEditForm}
        />
        <FormControlledSelect
          control={control}
          errors={errors}
          name="projectId"
          label="Seleccione un proyecto"
          options={projectOptions ?? []}
          isClearable
        />
        <FormControlledTaxPayerId
          control={control}
          errors={errors}
          razonSocialName="taxPayer.razonSocial"
          rucName="taxPayer.ruc"
          setValue={setValue}
          helperText="Ruc del donante."
        />
        {user && (
          <FormControlledImageUpload
            control={control}
            errors={errors}
            urlName="imbursementProof.url"
            idName="imbursementProof.imageName"
            label="Comprobante del desembolso"
            setValue={setValue}
            helperText="Favor tener en cuenta la orientación y legibilidad del documento."
            userId={user.id}
          />
        )}
        {user && (
          <FormControlledImageUpload
            control={control}
            errors={errors}
            urlName="invoiceFromOrg.url"
            idName="invoiceFromOrg.imageName"
            label="Factura por el desembolso"
            setValue={setValue}
            helperText="Favor tener en cuenta la orientación y legibilidad del documento."
            userId={user.id}
          />
        )}
      </VStack>
    </>
  );
};

export default ImbursementForm;
