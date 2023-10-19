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
import Decimal from 'decimal.js';
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
  allowNegativeValue?: boolean;
}

const FormControlledMoneyInput = <T extends FieldValues>({
  control,
  name,
  allowNegativeValue,
  errors,
  label,
  helperText,
  prefix,
  hidden,
  currency,
  totalAmount,
  disable,
}: InputProps<T>) => {
  const splitName = name.split('.');
  const reduceErrors = splitName.reduce((acc: any, curr: any) => {
    if (!acc[curr]) return acc;
    if (isNaN(curr)) {
      return acc[curr];
    }
    return acc[parseInt(curr)];
  }, errors);
  return (
    <FormControl
      display={hidden ? 'none' : 'block'}
      isInvalid={!!reduceErrors.message}
    >
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
              allowNegativeValue={allowNegativeValue}
              decimalSeparator="."
              prefix={prefix ?? 'Gs. '}
              onValueChange={(value) => {
                if (value?.endsWith('.') && currency === 'USD') {
                  return field.onChange(value as any);
                }
                return value
                  ? field.onChange(new Prisma.Decimal(value) as any)
                  : field.onChange(0 as any);
              }}
            />
            {totalAmount && (
              <InputRightElement
                onClick={() => field.onChange(totalAmount as any)}
              >
                <Button isDisabled={disable}>MAX </Button>
              </InputRightElement>
            )}
          </InputGroup>
        )}
      />
      {!reduceErrors.message ? (
        <FormHelperText color={'gray.500'}>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{reduceErrors.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledMoneyInput;
