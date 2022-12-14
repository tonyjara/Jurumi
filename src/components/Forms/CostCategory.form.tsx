import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Divider, HStack, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import type { ProjectWithCostCat } from '../../lib/validations/project.validate';
import { defaultCostCat } from '../../lib/validations/project.validate';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const CostCategoryForm = ({
  control,
  errors,
}: formProps<ProjectWithCostCat>) => {
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'costCategories',
  });

  return (
    <>
      <Divider my={'10px'} />
      <HStack justifyContent={'space-between'}>
        <Text fontSize={'lg'}> Lineas presupuestarias</Text>
        <IconButton
          onClick={() => prepend(defaultCostCat)}
          aria-label="add"
          icon={<AddIcon />}
        />
      </HStack>
      {fields.map((x, index) => {
        const currency = x.currency;
        return (
          <HStack key={x.id} spacing={5}>
            <IconButton
              onClick={() => remove(index)}
              mt={'22px'}
              aria-label="delete"
              icon={<DeleteIcon />}
            />
            <FormControlledText
              control={control}
              errors={errors}
              name={`costCategories.${index}.displayName`}
              label="Nombre"
            />
            <FormControlledMoneyInput
              control={control}
              errors={errors}
              name={`costCategories.${index}.balance`}
              label="Monto"
              prefix={translateCurrencyPrefix(currency)}
              currency={currency}
            />
          </HStack>
        );
      })}
    </>
  );
};

export default CostCategoryForm;
