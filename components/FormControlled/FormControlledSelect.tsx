import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  useColorModeValue,
} from "@chakra-ui/react";
import type { ChakraStylesConfig } from "chakra-react-select";
import { Select } from "chakra-react-select";
import React from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Controller } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  name: Path<T>;
  label?: string;
  helperText?: string;
  options: { value: string; label: string }[] | any[];
  isClearable?: boolean;
  error?: string;
  onChangeMw?: () => void; //middlewarish func
  onAfterChange?: (val: any) => void; //execute after change and receive the value
  isMulti?: boolean;
  optionLabel?: string;
  optionValue?: string;
  disable?: boolean;
  value?: any;
  hidden?: boolean;
}

const FormControlledSelect = <T extends FieldValues>({
  control,
  value,
  name,
  errors,
  label,
  options,
  helperText,
  isClearable,
  error,
  onChangeMw,
  isMulti,
  optionLabel,
  optionValue,
  disable,
  hidden,
  onAfterChange,
}: InputProps<T>) => {
  const handleOnChange = (e: any, field: ControllerRenderProps<T, Path<T>>) => {
    if (!isMulti) {
      if (!optionValue) {
        return field.onChange(e?.value ?? null);
      }

      return field.onChange(e ? e[optionValue] : null);
    }

    if (isMulti) {
      field.onChange(e ? e : []);
    }
  };
  const handleValue = (field: ControllerRenderProps<T, Path<T>>) => {
    if (!isMulti) {
      if (!optionValue) {
        return options.find((x) => x.value === field.value) ?? {};
      }
      return options.find((x) => x[optionValue] === field.value) ?? {};
    }

    return field.value;
  };

  const dropDownColor = useColorModeValue("#CBD5E0", "#4A5568");

  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided: any) => ({
      ...provided,
      background: dropDownColor,
      p: 0,
      w: "40px",
    }),
  };

  return (
    <FormControl
      display={hidden ? "none" : undefined}
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
          <Select
            isDisabled={disable}
            instanceId={name}
            options={options}
            onChange={(e) => {
              onChangeMw && onChangeMw();
              handleOnChange(e, field);
              onAfterChange && onAfterChange(e);
            }}
            chakraStyles={chakraStyles}
            value={value ? handleValue({ value } as any) : handleValue(field)}
            noOptionsMessage={() => "No hay opciones."}
            placeholder=""
            isClearable={isClearable}
            isMulti={isMulti}
            getOptionLabel={optionLabel ? (x) => x[optionLabel] : undefined}
            getOptionValue={optionValue ? (x) => x[optionValue] : undefined}
            classNamePrefix="myDropDown"
          />
        )}
      />
      {!errors[name] ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormControlledSelect;
