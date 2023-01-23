import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type {
  Control,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { CgFileDocument } from 'react-icons/cg';
import { PatternFormat } from 'react-number-format';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  hidden?: boolean;
  autoFocus?: boolean;
}

const FormControlledFacturaNumber = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const { control, name, errors, label, helperText, hidden, autoFocus } = props;
  const watchValue = useWatch({ control, name });

  const [inputValue, setInputValue] = useState<string>(watchValue);
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
              value={inputValue}
              label={label}
              error={errors.facturaNumber?.message ?? undefined}
              customInput={Input}
              allowEmptyFormatting
              onValueChange={({ formattedValue, value }) => {
                field.onChange(value);
                setInputValue(formattedValue);
              }}
              format={'###-###-#######'}
              mask="_"
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

export default FormControlledFacturaNumber;
