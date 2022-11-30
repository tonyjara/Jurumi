import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import type {
  Control,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { CgFileDocument } from 'react-icons/cg';
import { PatternFormat } from 'react-number-format';
import { trim } from 'lodash';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  hidden?: boolean;
  autoFocus?: boolean;
}

const FormControlledPyInvoiceNumber = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const {
    control,
    name,
    errors,
    label,
    helperText,

    hidden,
    autoFocus,
  } = props;
  return (
    <FormControl hidden={hidden} isInvalid={!!errors[name]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputGroup>
            <InputRightElement pointerEvents={'none'}>
              <CgFileDocument />
            </InputRightElement>
            <PatternFormat
              value={field.value}
              label={label}
              error={errors.facturaNumber?.message ? true : false}
              helperText={helperText}
              fullWidth
              customInput={Input}
              allowEmptyFormatting
              onValueChange={({ formattedValue }: any) => {
                field.onChange(trim(formattedValue));
              }}
              format={'### ### #######'}
              placeholder={'___-___-_______'}
              autoFocus={autoFocus}
            />
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

export default FormControlledPyInvoiceNumber;
