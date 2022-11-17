import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Flex,
  Switch,
} from '@chakra-ui/react';
import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  type?: string;
  inputRight?: any;
}

const FormControlledSwitch = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  helperText,
}: InputProps<T>) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <Flex alignItems={'center'} justifyContent="space-between">
        <FormLabel color={'gray.500'}>{label}</FormLabel>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Switch
              marginTop={-2}
              size={'lg'}
              isChecked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Flex>
      {!errors[name] ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledSwitch;
