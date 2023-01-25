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
import FormControlledFacturaNumber from '../FormControlled/FormControlledFacturaNumber';

import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledTaxPayerId from '../FormControlled/FormControlledTaxPayerId';
import FormControlledText from '../FormControlled/FormControlledText';
import type { FormExpenseReport } from '../../lib/validations/expenseReport.validate';
import {
  reduceExpenseReports,
  reduceExpenseReturns,
} from '@/lib/utils/TransactionUtils';
import type { CompleteMoneyReqHome } from '@/pageContainers/home/requests/HomeRequestsPage.home.requests';
import SeedButton from '../DevTools/SeedButton';
import { expenseReportMock } from '@/__tests__/mocks/Mocks';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  moneyRequest?: CompleteMoneyReqHome;
  reset: UseFormReset<FormExpenseReport>;
  isEdit?: boolean;
}

const ExpenseReportForm = ({
  control,
  errors,
  moneyRequest,
  setValue,
  reset,
  isEdit,
}: formProps<FormExpenseReport>) => {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: projects } = trpcClient.project.getMany.useQuery();

  const currency = useWatch({ control, name: 'currency' });
  const projectId = useWatch({ control, name: 'projectId' });

  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
    { projectId: projectId ?? '' },
    { enabled: !!projectId?.length }
  );

  const costCatOptions = () =>
    costCats?.map((cat) => ({
      value: cat.id,
      label: `${cat.displayName}`,
    }));

  const firstOption = costCats ? costCats[0] : null;

  return (
    <VStack spacing={5}>
      {projectId && moneyRequest && firstOption && (
        <SeedButton
          reset={reset}
          mock={() =>
            expenseReportMock({
              moneyReqId: moneyRequest.id,
              projectId,
              costCategoryId: firstOption.id,
            })
          }
        />
      )}
      <FormControlledText
        control={control}
        errors={errors}
        name="concept"
        label="Concepto"
      />
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="currency"
        label="Moneda"
        options={currencyOptions}
        disable={isEdit}
      />
      <FormControlledMoneyInput
        disable={isEdit}
        control={control}
        errors={errors}
        name={'amountSpent'}
        label="Monto"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
        totalAmount={
          moneyRequest &&
          moneyRequest.amountRequested
            .sub(reduceExpenseReports(moneyRequest.expenseReports))
            .sub(reduceExpenseReturns(moneyRequest.expenseReturns))
        }
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
        disable={isEdit}
      />
      {costCatOptions()?.length && (
        <FormControlledSelect
          control={control}
          errors={errors}
          name={'costCategoryId'}
          label="Linea presupuestaria"
          options={costCatOptions() ?? []}
          isClearable
          disable={isEdit}
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
