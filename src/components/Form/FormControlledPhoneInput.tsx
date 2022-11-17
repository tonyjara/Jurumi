import { PhoneIcon } from '@chakra-ui/icons';
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
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  maxLength?: number;
}

const FormControlledPhoneInput = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  helperText,
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
          <InputGroup>
            <InputRightElement pointerEvents={'none'}>
              <PhoneIcon />
            </InputRightElement>

            <PatternFormat
              borderColor={'gray.300'}
              value={field.value}
              customInput={Input}
              format={'#### ### ###'}
              mask="_"
              allowEmptyFormatting
              onValueChange={({ formattedValue }: any) => {
                field.onChange(formattedValue);
              }}
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

export default FormControlledPhoneInput;
