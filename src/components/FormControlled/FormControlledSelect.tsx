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
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
// import Select from 'react-select';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<any>;
  name: Path<T>;
  label: string;
  helperText?: string;
  options: { value: string; label: string }[];
  isClearable?: boolean;
}

const FormControlledSelect = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  options,
  helperText,
  isClearable,
}: InputProps<T>) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            options={options}
            onChange={(e) => field.onChange(e?.value ?? '')}
            value={options.find((x) => x.value === field.value)}
            noOptionsMessage={() => ''}
            placeholder=""
            isClearable={isClearable}
          />
        )}
      />
      {!errors[name] ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledSelect;