import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import React from 'react';
import {
  Control,
  Controller,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<any>;
  name: Path<T>;
  label: string;
  helperText?: string;
  maxLength?: number;
  inputRight?: any;
  inputLeft?: any;
  prefix?: string;
  hidden?: boolean;
}

const FormControlledNumberInput = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  helperText,
  inputRight,
  inputLeft,
  prefix,
  hidden,
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
          <InputGroup>
            {inputLeft && (
              <InputLeftElement pointerEvents={'none'}>
                {inputLeft}
              </InputLeftElement>
            )}
            <NumericFormat
              value={field.value}
              thousandSeparator=","
              decimalScale={0}
              prefix={prefix}
              onValueChange={(v: any) => {
                field.onChange(v?.floatValue ?? 0);
              }}
              onFocus={(e: any) => {
                e.target.select();
              }}
              customInput={Input}
              borderColor={'gray.300'}
            />

            {inputRight}
          </InputGroup>
        )}
      />
      {!errors[name] ? (
        <FormHelperText color={'gray.500'}>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledNumberInput;
