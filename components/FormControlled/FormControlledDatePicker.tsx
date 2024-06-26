import React, { useState, useEffect } from "react";
import es from "date-fns/locale/es";

import type {
  Control,
  DeepMap,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import format from "date-fns/format";
import { isValid, parse } from "date-fns";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";

import { CalendarIcon } from "@chakra-ui/icons";
import useDebounce from "@/lib/hooks/useDebounce";

interface controllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  errors: DeepMap<any, FieldError>;
  label: string;
  hidden?: boolean;
  helperText?: string;
  index?: number; //used for form arrays errors
  error?: string; // escape hatch for nested objects
}

const FormControlledDatePicker = <T extends FieldValues>(
  props: controllerProps<T>,
) => {
  const { name, control, errors, label, hidden, helperText, error } = props;
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const borderColor = useColorModeValue("gray.300", "white");
  const watchValue = useWatch({ control, name });

  const debouncedWatchValue = useDebounce(watchValue, 500);

  // Converts selected value to parsed string for input
  useEffect(() => {
    if (debouncedWatchValue) {
      setSelectedDate(debouncedWatchValue);
      const date = format(debouncedWatchValue, "dd-MM-y");
      setInputValue(date);
    }

    return () => {};
  }, [debouncedWatchValue]);

  // when changing the input if the date is valid it selects the date
  const handleInputChangeWithField = (e: any, onChange: any) => {
    open && setOpen(false);
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, "dd-MM-y", new Date());
    if (isValid(date)) {
      setSelectedDate(date);
      onChange(date);
    } else {
      setSelectedDate(undefined);
      onChange(undefined);
    }
  };
  const handleDaySelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      setInputValue(format(date, "dd-MM-y"));
      // closePopper();
      setOpen(false);
    } else {
      setInputValue("");
    }
  };

  return (
    <FormControl
      display={hidden ? "none" : "block"}
      isInvalid={!!errors[name] || !!error?.length}
    >
      <FormLabel
        fontSize={"md"}
        color={"gray.600"}
        _dark={{ color: "gray.400" }}
      >
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Popover isOpen={open}>
              <PopoverTrigger>
                <InputGroup>
                  <Input
                    onClick={() => open && setOpen(false)}
                    type="text"
                    placeholder={format(new Date(), "dd-MM-y")}
                    value={inputValue}
                    onChange={(e) =>
                      handleInputChangeWithField(e, field.onChange)
                    }
                    borderColor={borderColor}
                  />
                  <InputRightElement
                    cursor={"pointer"}
                    onClick={() => setOpen(true)}
                  >
                    <CalendarIcon />
                  </InputRightElement>
                </InputGroup>
              </PopoverTrigger>

              <PopoverContent>
                <DayPicker
                  mode="single"
                  defaultMonth={selectedDate}
                  selected={selectedDate}
                  /* onSelect={(e: Date | undefined) => { */
                  onSelect={(e: any) => {
                    handleDaySelect(e);

                    field.onChange(e ? e : null);
                  }}
                  locale={es}
                />
                <Button onClick={() => setOpen(false)}>Cerrar</Button>
              </PopoverContent>
              {<div style={{ color: "red" }}>{errors[name]?.message}</div>}
            </Popover>
          );
        }}
      />
      {!!error?.length && <FormErrorMessage>{error}</FormErrorMessage>}
      {!errors[name] ? (
        <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledDatePicker;
