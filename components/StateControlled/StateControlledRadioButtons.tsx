import {
  FormControl,
  FormLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import React from 'react';

interface props {
  label: string;
  helperText?: string;
  options: { value: string; label: string }[];
  hidden?: boolean;
  state: null | { label: string; value: string };
  onChange: (x: any) => void;
}

const StateControlledRadioButtons = ({
  label,
  options,
  helperText,
  hidden,
  state,
  onChange,
}: props) => {
  return (
    <FormControl display={hidden ? 'none' : 'block'}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        {label}
      </FormLabel>

      <RadioGroup onChange={onChange} value={state?.value}>
        <Stack direction="row">
          {options.map((x) => (
            <Radio key={x.value} value={x.value}>
              {x.label}
            </Radio>
          ))}
          3
        </Stack>
      </RadioGroup>

      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default StateControlledRadioButtons;
