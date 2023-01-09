import 'react-day-picker/dist/style.css';
import React, { useState, useEffect } from 'react';
import es from 'date-fns/locale/es';

import type {
  Control,
  DeepMap,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import format from 'date-fns/format';
import { fromUnixTime, getUnixTime, isValid, parse } from 'date-fns';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';

import { CalendarIcon } from '@chakra-ui/icons';

interface controllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  errors: DeepMap<any, FieldError>;
  label: string;
  hidden?: boolean;
}

const FormControlledDatePicker = <T extends FieldValues>(
  props: controllerProps<T>
) => {
  const { name, control, errors, label, hidden } = props;
  const [selected, setSelected] = React.useState<Date>();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  const watchValue = useWatch({ control, name });

  useEffect(() => {
    if (watchValue) {
      setSelected(fromUnixTime(watchValue));
      const date = format(fromUnixTime(watchValue), 'dd-MM-y');
      setInputValue(date);
    }

    return () => {};
  }, [watchValue]);

  const handleInputChangeWithField = (e: any, onChange: any) => {
    open && setOpen(false);
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, 'dd-MM-y', new Date());
    if (isValid(date)) {
      setSelected(date);
      onChange(getUnixTime(date));
    } else {
      setSelected(undefined);
    }
  };
  const handleDaySelect = (date: Date | undefined) => {
    setSelected(date);

    if (date) {
      setInputValue(format(date, 'dd-MM-y'));
      // closePopper();
      setOpen(false);
    } else {
      setInputValue('');
    }
  };

  return (
    <FormControl display={hidden ? 'none' : 'block'} isInvalid={!!errors[name]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
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
                    onClick={() => setOpen(true)}
                    type="text"
                    placeholder={format(new Date(), 'dd-MM-y')}
                    value={inputValue}
                    onChange={(e) =>
                      handleInputChangeWithField(e, field.onChange)
                    }
                  />
                  <InputRightElement
                    cursor={'pointer'}
                    onClick={() => setOpen(true)}
                  >
                    <CalendarIcon />
                  </InputRightElement>
                </InputGroup>
              </PopoverTrigger>

              <PopoverContent>
                <DayPicker
                  mode="single"
                  defaultMonth={selected}
                  selected={selected}
                  onSelect={(e: Date | undefined) => {
                    handleDaySelect(e);

                    field.onChange(e ? getUnixTime(e) : null);
                  }}
                  locale={es}
                />
                <Button onClick={() => setOpen(false)}>Cerrar</Button>
              </PopoverContent>
              {<div style={{ color: 'red' }}>{errors[name]?.message}</div>}
            </Popover>
          );
        }}
      />
    </FormControl>
  );
};

export default FormControlledDatePicker;
