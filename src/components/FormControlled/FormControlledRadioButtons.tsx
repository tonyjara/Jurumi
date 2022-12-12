import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import type {
  Control,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  options: { value: string; label: string }[];
  hidden?: boolean;
  onChangeMw?: () => void; //middlewarish func
}

const FormControlledRadioButtons = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  options,
  helperText,
  hidden,
  onChangeMw,
}: InputProps<T>) => {
  return (
    <FormControl display={hidden ? 'none' : 'block'} isInvalid={!!errors[name]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            onChange={(e) => {
              onChangeMw && onChangeMw();
              field.onChange(e);
            }}
            value={field.value}
          >
            <Stack direction="row">
              {options.map((x) => (
                <Radio key={x.value} value={x.value}>
                  {x.label}
                </Radio>
              ))}
              3
            </Stack>
          </RadioGroup>
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

export default FormControlledRadioButtons;
