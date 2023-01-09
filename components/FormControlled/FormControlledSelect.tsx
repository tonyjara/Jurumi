import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import React from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<any>;
  name: Path<T>;
  label: string;
  helperText?: string;
  options: { value: string; label: string }[] | any[];
  isClearable?: boolean;
  error?: string;
  onChangeMw?: () => void; //middlewarish func
  isMulti?: boolean;
  optionLabel?: string;
  optionValue?: string;
}

const FormControlledSelect = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  options,
  helperText,
  isClearable,
  error,
  onChangeMw,
  isMulti,
  optionLabel,
  optionValue,
}: InputProps<T>) => {
  const handleOnChange = (e: any, field: ControllerRenderProps<T, Path<T>>) => {
    if (!isMulti) {
      if (!optionValue) {
        return field.onChange(e?.value ?? '');
      }

      return field.onChange(e ? e[optionValue] : '');
    }

    if (isMulti) {
      field.onChange(e ? e : []);
    }
  };
  const handleValue = (field: ControllerRenderProps<T, Path<T>>) => {
    if (!isMulti) {
      if (!optionValue) {
        return options.find((x) => x.value === field.value) ?? {};
      }
      return options.find((x) => x[optionValue] === field.value) ?? {};
    }

    return field.value;
  };

  return (
    <FormControl isInvalid={!!errors[name] || !!error}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            instanceId={name}
            options={options}
            onChange={(e) => {
              onChangeMw && onChangeMw();
              handleOnChange(e, field);
            }}
            value={handleValue(field)}
            noOptionsMessage={() => 'No hay opciones.'}
            placeholder=""
            isClearable={isClearable}
            isMulti={isMulti}
            getOptionLabel={optionLabel ? (x) => x[optionLabel] : undefined}
            getOptionValue={optionValue ? (x) => x[optionValue] : undefined}
          />
        )}
      />
      {!errors[name] ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormControlledSelect;
