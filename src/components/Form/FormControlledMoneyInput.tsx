import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Prisma } from '@prisma/client';
import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import type {
  Control,
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
  maxLength?: number;
  inputRight?: any;
  inputLeft?: any;
  prefix: string;
  hidden?: boolean;
}

const FormControlledMoneyInput = <T extends FieldValues>({
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
            <CurrencyInput
              id="input-example"
              customInput={Input}
              // placeholder="Please enter a number"
              // defaultValue={1000}
              name={name}
              value={field.value}
              decimalScale={2} // precision
              fixedDecimalLength={2}
              groupSeparator=","
              decimalSeparator="."
              prefix={prefix ?? 'Gs. '}
              onValueChange={(value) => {
                if (value?.endsWith('.')) {
                  return field.onChange(value);
                }
                return value
                  ? field.onChange(new Prisma.Decimal(value))
                  : field.onChange('');
              }}
            />
            ;{inputRight}
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

export default FormControlledMoneyInput;
