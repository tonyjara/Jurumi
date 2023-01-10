import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Divider, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import type { FormProject } from '../../lib/validations/project.validate';
import { defaultProjectStage } from '../../lib/validations/project.validate';
import FormControlledDatePicker from '../FormControlled/FormControlledDatePicker';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const ProjectStageForm = ({ control, errors }: formProps<FormProject>) => {
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'projectStages',
  });

  return (
    <>
      <Divider my={'10px'} />
      <HStack justifyContent={'space-between'}>
        <Text fontSize={'lg'} fontWeight="bold">
          {' '}
          Etapas del proyecto
        </Text>
        <IconButton
          onClick={() => prepend(defaultProjectStage)}
          aria-label="add"
          icon={<AddIcon />}
        />
      </HStack>
      {fields.map((x, index) => {
        const currency = x.currency;

        return (
          <VStack mt={'10px'} spacing={5} key={x.id}>
            <HStack spacing={5}>
              <FormControlledText
                control={control}
                errors={errors}
                name={`projectStages.${index}.displayName`}
                label="Etapa"
                helperText="Ej.: Primera etapa"
                error={
                  errors.projectStages
                    ? errors?.projectStages[index]?.displayName?.message
                    : ''
                }
              />
              <FormControlledMoneyInput
                control={control}
                errors={errors}
                name={`projectStages.${index}.expectedFunds`}
                label="Fondos previstos."
                prefix={translateCurrencyPrefix(currency)}
                currency={currency}
                helperText="Fondos a recibir"
              />
              <IconButton
                onClick={() => remove(index)}
                mt={'22px'}
                aria-label="delete"
                icon={<DeleteIcon />}
              />
            </HStack>
            <HStack spacing={5}>
              <FormControlledDatePicker
                control={control}
                errors={errors}
                name={`projectStages.${index}.startDate`}
                label="Inicio"
                index={index}
                error={
                  errors.projectStages
                    ? errors?.projectStages[index]?.startDate?.message
                    : ''
                }
                helperText="Inicio de la etapa"
              />
              <FormControlledDatePicker
                control={control}
                errors={errors}
                name={`projectStages.${index}.endDate`}
                label="Fin"
                helperText="No requerido."
              />
            </HStack>

            <Divider />
          </VStack>
        );
      })}
    </>
  );
};

export default ProjectStageForm;
