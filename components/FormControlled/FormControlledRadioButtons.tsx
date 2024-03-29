import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import type {
  Control,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from "react-hook-form";
import { Controller } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  options: { value: string; label: string }[];
  hidden?: boolean;
  onChangeMw?: (e: any) => void; //middlewarish func
  disable?: boolean;
  error?: string; // escape hatch for nested objects
  value?: any;
}

const FormControlledRadioButtons = <T extends FieldValues>({
  control,
  value,
  name,
  errors,
  label,
  options,
  helperText,
  hidden,
  onChangeMw,
  disable,
  error,
}: InputProps<T>) => {
  return (
    <FormControl
      display={hidden ? "none" : "block"}
      isInvalid={!!errors[name] || !!error}
    >
      <FormLabel
        fontSize={"md"}
        color={"gray.600"}
        _dark={{ color: "gray.400" }}
      >
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            isDisabled={disable}
            onChange={(e) => {
              onChangeMw && onChangeMw(e);
              field.onChange(e as any);
            }}
            value={value ?? field.value}
          >
            <Stack direction="row">
              {options.map((x) => (
                <Radio key={x.value} value={x.value}>
                  {x.label}
                </Radio>
              ))}
              3
            </Stack>
          </RadioGroup>
        )}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {!errors[name] ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledRadioButtons;
