import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Divider, HStack, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import type { FormProject } from '../../lib/validations/project.validate';
import { defaultCostCategoryData } from '../../lib/validations/project.validate';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const CostCategoryForm = ({ control, errors }: formProps<FormProject>) => {
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'costCategories',
  });

  return (
    <>
      <Divider my={'10px'} />
      <HStack justifyContent={'space-between'}>
        <Text fontSize={'lg'} fontWeight="bold">
          {' '}
          Lineas presupuestarias
        </Text>
        <IconButton
          onClick={() => prepend(defaultCostCategoryData)}
          aria-label="add"
          icon={<AddIcon />}
        />
      </HStack>
      {fields.map((x, index) => {
        const currency = x.currency;
        return (
          <HStack key={x.id} spacing={5}>
            <FormControlledText
              control={control}
              errors={errors}
              name={`costCategories.${index}.displayName`}
              label="Nombre"
              error={
                errors.costCategories
                  ? errors?.costCategories[index]?.displayName?.message
                  : ''
              }
            />
            <FormControlledMoneyInput
              control={control}
              errors={errors}
              name={`costCategories.${index}.openingBalance`}
              label="Balance inicial."
              prefix={translateCurrencyPrefix(currency)}
              currency={currency}
            />
            <IconButton
              onClick={() => remove(index)}
              aria-label="delete"
              icon={<DeleteIcon />}
            />
          </HStack>
        );
      })}
    </>
  );
};

export default CostCategoryForm;