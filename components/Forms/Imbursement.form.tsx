import { currencyOptions } from '@/lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '@/lib/utils/TranslatedEnums';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormImbursement } from '@/lib/validations/imbursement.validate';
import { Button, Divider, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type { FieldValues, Control, UseFormSetValue } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
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
}

const ImbursementForm = ({
  control,
  errors,
  setValue,
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
  const projectId = useWatch({ control, name: 'projectId' });

  const handleConvert = () => {
    setValue('finalAmount', amountInOtherCurrency * exchangeRate);
  };

  const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
    { projectId: projectId ?? '' },
    { enabled: !!projectId?.length }
  );
  const { data: projects } = trpcClient.project.getMany.useQuery();

  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  const costCatOptions = () =>
    costCats?.map((cat) => ({
      value: cat.id,
      label: `${cat.displayName}`,
    }));

  return (
    <>
      <VStack spacing={5}>
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
        />
        <FormControlledMoneyInput
          control={control}
          errors={errors}
          name="amountInOtherCurrency"
          label="Monto recibido"
          prefix={translateCurrencyPrefix(otherCurrency)}
          currency={otherCurrency}
          helperText={
            'Una vez creada la cuenta este valor NO se puede modificar.'
          }
        />
        <FormControlledSwitch
          control={control}
          errors={errors}
          name="wasConvertedToOtherCurrency"
          label="Convertir a otra moneda:  No - Si"
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
            />
            <FormControlledRadioButtons
              control={control}
              errors={errors}
              name="finalCurrency"
              label="Convertir a:"
              options={currencyOptions}
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
            />
            <Button onClick={handleConvert}>Convertir</Button>
          </>
        )}
        <Divider />

        <FormControlledSelect
          control={control}
          errors={errors}
          name="projectId"
          label="Seleccione un proyecto"
          options={projectOptions ?? []}
        />
        <FormControlledTaxPayerId
          control={control}
          errors={errors}
          razonSocialName="taxPayer.razonSocial"
          rucName="taxPayer.ruc"
          setValue={setValue}
          helperText="Ruc del donante."
        />
        {/* {costCatOptions()?.length && (
          <FormControlledSelect
            control={control}
            errors={errors}
            name="costCategoryId"
            label="Linea presupuestaria"
            options={costCatOptions() ?? []}
          />
        )} */}
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
    </>
  );
};

export default ImbursementForm;
