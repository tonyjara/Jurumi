// This component handles everythinf so that looking for a taxpayer from datospy or our own database is a smooth process.

import { Search2Icon } from '@chakra-ui/icons';
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

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  autoFocus?: boolean;
}
export interface datosPyResponse {
  razonsocial: string;
  documento: string;
  dv: string;
}
const FormControlledTaxPayerId = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const { control, name, errors, autoFocus } = props;

  // const res = (await axios(`https://rucs.datospy.org/api/${idCard}`)) as {
  //   data: datosPyCustomer[];
  // };
  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        Ruc del contribuyente
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputGroup>
            <Input
              borderColor={'gray.300'}
              maxLength={20}
              value={field.value}
              onChange={field.onChange}
              autoFocus={autoFocus}
            />

            <InputRightElement pointerEvents={'none'}>
              <Search2Icon />
            </InputRightElement>
          </InputGroup>
        )}
      />

      {!errors[name] ? (
        <FormHelperText color={'gray.500'}>
          Ingrese el ruc y aguarde la busqueda.
        </FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledTaxPayerId;
