import { VStack } from '@chakra-ui/react';
import type { Project } from '@prisma/client';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const ProjectForm = ({ control, errors }: formProps<Project>) => {
  const currency = useWatch({ control, name: 'assignedMoneyCurrency' });

  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="displayName"
        label="Nombre de su proyecto"
      />

      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="assignedMoneyCurrency"
        label="Moneda"
        options={currencyOptions}
      />
      <FormControlledMoneyInput
        control={control}
        errors={errors}
        name="assignedMoney"
        label="Dinero asignado."
        helperText="El dinero asignado no afecta las cuentas bancarias. Se usa para tener una referencia del total disponible."
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />
    </VStack>
  );
};

export default ProjectForm;
