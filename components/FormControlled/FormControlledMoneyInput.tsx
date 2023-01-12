import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import type { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';
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
  prefix: string;
  hidden?: boolean;
  currency: Currency;
  totalAmount?: Decimal;
  disable?: boolean;
}

const FormControlledMoneyInput = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  helperText,
  prefix,
  hidden,
  currency,
  totalAmount,
  disable,
}: InputProps<T>) => {
  return (
    <FormControl display={hidden ? 'none' : 'block'} isInvalid={!!errors[name]}>
      <FormLabel whiteSpace={'nowrap'} fontSize={'md'} color={'gray.500'}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputGroup>
            <CurrencyInput
              disabled={disable}
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
            {totalAmount && (
              <InputRightElement onClick={() => field.onChange(totalAmount)}>
                <Button>MAX </Button>
              </InputRightElement>
            )}
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
