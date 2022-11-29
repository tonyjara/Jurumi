import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import type { Currency } from '@prisma/client';
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
  currency: Currency;
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
  currency,
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
              name={name}
              value={field.value}
              decimalScale={currency === 'PYG' ? 0 : 2} // precision
              //This makes the input crash have errors
              // fixedDecimalLength={currency === 'PYG' ? 0 : 2}
              groupSeparator=","
              decimalSeparator="."
              prefix={prefix ?? 'Gs. '}
              onValueChange={(value) => {
                if (value?.endsWith('.') && currency === 'USD') {
                  return field.onChange(value);
                }
                return value
                  ? field.onChange(new Prisma.Decimal(value))
                  : field.onChange(0);
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
