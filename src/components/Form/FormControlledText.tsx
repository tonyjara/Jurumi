import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';
import {
  Control,
  Controller,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  type?: string;
  maxLength?: number;
  inputRight?: any;
  inputLeft?: any;
  isTextArea?: boolean;
  hidden?: boolean;
}

const FormControlledText = <T extends FieldValues>(props: InputProps<T>) => {
  const {
    control,
    name,
    errors,
    label,
    helperText,
    type,
    inputRight,
    maxLength,
    inputLeft,
    isTextArea,
    hidden,
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
            {inputLeft && (
              <InputLeftElement pointerEvents={'none'}>
                {inputLeft}
              </InputLeftElement>
            )}
            {!isTextArea && (
              <Input
                borderColor={'gray.300'}
                maxLength={maxLength}
                value={field.value}
                onChange={field.onChange}
                type={type}
              />
            )}
            {isTextArea && (
              <Textarea
                borderColor={'gray.300'}
                maxLength={maxLength}
                value={field.value}
                onChange={field.onChange}
              />
            )}
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

export default FormControlledText;
