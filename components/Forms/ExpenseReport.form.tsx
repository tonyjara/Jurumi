import { VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledFacturaNumber from '../FormControlled/FormControlledFacturaNumber';

import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledTaxPayerId from '../FormControlled/FormControlledTaxPayerId';
import FormControlledText from '../FormControlled/FormControlledText';
import type { FormExpenseReport } from '../../lib/validations/expenseReport.validate';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const ExpenseReportForm = ({
  control,
  errors,
  setValue,
}: formProps<FormExpenseReport>) => {
  const { data: session } = useSession();
  const user = session?.user;
  const projectId = useWatch({ control, name: 'projectId' });
  const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
    { projectId: projectId ?? '' },
    { enabled: !!projectId?.length }
  );
  const { data: projects } = trpcClient.project.getMany.useQuery();

  const currency = useWatch({ control, name: 'currency' });

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
    <VStack spacing={5}>
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
        name={'amountSpent'}
        label="Monto"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />

      <FormControlledTaxPayerId
        control={control}
        errors={errors}
        razonSocialName="taxPayer.razonSocial"
        rucName="taxPayer.ruc"
        setValue={setValue}
      />
      <FormControlledFacturaNumber
        control={control}
        errors={errors}
        name="facturaNumber"
        label="Número de factura."
      />
      {user && (
        <FormControlledImageUpload
          control={control}
          errors={errors}
          urlName="searchableImage.url"
          idName="searchableImage.imageName"
          label="Foto de su comprobante"
          setValue={setValue}
          userId={user.id}
          helperText="Favor tener en cuenta la orientación y legibilidad del documento."
        />
      )}

      <FormControlledSelect
        control={control}
        errors={errors}
        name="projectId"
        label="Seleccione un proyecto"
        options={projectOptions ?? []}
        isClearable
      />
      {costCatOptions()?.length && (
        <FormControlledSelect
          control={control}
          errors={errors}
          name="costCategoryId"
          label="Linea presupuestaria"
          options={costCatOptions() ?? []}
          isClearable
        />
      )}

      <FormControlledText
        control={control}
        errors={errors}
        name="comments"
        isTextArea={true}
        label="Comentarios (opcional)"
      />
    </VStack>
  );
};

export default ExpenseReportForm;
