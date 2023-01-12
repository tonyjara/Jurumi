import { currencyOptions } from '@/lib/utils/SelectOptions';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Divider, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import type { FormProject } from '../../lib/validations/project.validate';
import { defaultProjectStage } from '../../lib/validations/project.validate';
import FormControlledDatePicker from '../FormControlled/FormControlledDatePicker';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const ProjectStageForm = ({
  control,
  errors,
  setValue,
}: formProps<FormProject>) => {
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'projectStages',
  });
  const watchedFields = useWatch({ control, name: 'projectStages' });

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
        const currency = watchedFields[index]?.currency;

        return (
          <VStack mt={'10px'} spacing={5} key={x.id}>
            <FormControlledText
              control={control}
              errors={errors}
              name={`projectStages.${index}.displayName`}
              label={`${index + 1}- Etapa`}
              helperText="Ej.: Primera etapa"
              error={
                errors.projectStages
                  ? errors?.projectStages[index]?.displayName?.message
                  : ''
              }
            />
            <HStack spacing={5}>
              <FormControlledRadioButtons
                control={control}
                errors={errors}
                name={`projectStages.${index}.currency`}
                label="Moneda"
                options={currencyOptions}
                onChangeMw={() =>
                  setValue(`projectStages.${index}.expectedFunds`, 0)
                }
              />
              <FormControlledMoneyInput
                control={control}
                errors={errors}
                name={`projectStages.${index}.expectedFunds`}
                label="Fondos previstos."
                prefix={translateCurrencyPrefix(currency ?? 'PYG')}
                currency={currency ?? 'PYG'}
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
