import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";
import type {
  Control,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { CgFileDocument } from "react-icons/cg";
import { PatternFormat } from "react-number-format";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  hidden?: boolean;
  autoFocus?: boolean;
  error?: string; // escape hatch for nested objects
}

const FormControlledFacturaNumber = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const { control, name, errors, label, helperText, hidden, autoFocus, error } =
    props;

  return (
    <FormControl hidden={hidden} isInvalid={!!errors[name] || !!error}>
      <FormLabel fontSize={"md"} color={"gray.500"}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <InputGroup>
              <InputRightElement pointerEvents={"none"}>
                <CgFileDocument />
              </InputRightElement>
              <PatternFormat
                value={field.value}
                label={label}
                error={errors.facturaNumber?.message ?? undefined}
                customInput={Input}
                allowEmptyFormatting
                onValueChange={({ value }) => {
                  field.onChange(value as any);
                }}
                format={"###-###-#######"}
                mask="_"
                autoFocus={autoFocus}
              />
            </InputGroup>
          );
        }}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {!errors[name] ? (
        <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledFacturaNumber;
