import { Divider, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import {
  currencyOptions,
  memberTypeOptions,
  moneyRequestStatusOptions,
  moneyRequestTypeOptions,
} from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { FormMoneyRequest } from '../../lib/validations/moneyRequest.validate';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import prisma from '@/server/db/client';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledTaxPayerId from '../FormControlled/FormControlledTaxPayerId';
import FormControlledText from '../FormControlled/FormControlledText';
import type { FormMember } from '@/lib/validations/member.validate';
import FormControlledDatePicker from '../FormControlled/FormControlledDatePicker';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  isEdit?: boolean;
}

const MemberForm = ({
  control,
  errors,
  setValue,
  isEdit,
}: formProps<FormMember>) => {
  const currency = useWatch({ control, name: 'currency' });

  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="displayName"
        label="Nombre del socio"
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="email"
        label="Email del socio"
      />
      <FormControlledMoneyInput
        control={control}
        errors={errors}
        name={'initialBalance'}
        label="Balance actual"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />
      <FormControlledDatePicker
        control={control}
        errors={errors}
        name={'memberSince'}
        label="Miembro desde:"
      />
      <FormControlledDatePicker
        control={control}
        errors={errors}
        name={'expirationDate'}
        label="Fecha de expiración"
        helperText="La fecha en la que vence la suscripción"
      />
      <FormControlledSelect
        control={control}
        errors={errors}
        name="memberType"
        label="Tipo de miembro"
        options={memberTypeOptions}
      />
    </VStack>
  );
};

export default MemberForm;
