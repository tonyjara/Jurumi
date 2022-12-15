// This component handles everythinf so that looking for a taxpayer from datospy or our own database is a smooth process.

import { Search2Icon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import { Select } from 'chakra-react-select';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldErrorsImpl,
  FieldValues,
  Path,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  autoFocus?: boolean;
}
export interface datosPyResponse {
  razonsocial: string;
  documento: string;
  dv: string;
}
const FormControlledTaxPayerId = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const { control, name, errors, autoFocus } = props;
  const [loading, setLoading] = useState(false);

  const watchTaxpayerId = useWatch({ control, name });

  const getDataFromDatosPy = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axios(`https://rucs.datospy.org/api/${id}`, {
        timeout: 5000,
      });
      console.log(data);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      return null;
    }
  };

  const debouncedQuery = debounce(
    async () => getDataFromDatosPy(watchTaxpayerId),
    500
  );

  useEffect(() => {
    if (watchTaxpayerId.length > 5) {
      // debounce(getDataFromDatosPy(watchTaxpayerId), 500)
      debouncedQuery();
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchTaxpayerId]);

  const handleOnChange = (e: any, field: ControllerRenderProps<T, Path<T>>) => {
    return field.onChange(e?.value ?? '');
  };

  const handleValue = (field: ControllerRenderProps<T, Path<T>>) => {
    // return [].find((x) => x.value === field.value) ?? {};

    return field.value;
  };

  {
    /* <Input
    borderColor={'gray.300'}
    maxLength={20}
    value={field.value}
    onChange={field.onChange}
    autoFocus={autoFocus}
   
  /> */
  }
  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        Ruc del contribuyente
      </FormLabel>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            instanceId={name}
            options={[]}
            onChange={(e) => {
              handleOnChange(e, field);
            }}
            value={handleValue(field)}
            noOptionsMessage={() => 'No hay opciones.'}
            placeholder=""
            isClearable
          />
        )}
      />

      {/* <InputRightElement pointerEvents={'none'}>
          {!loading && <Search2Icon />}
          {loading && <Spinner />}
        </InputRightElement> */}

      {!errors[name] ? (
        <FormHelperText color={'gray.500'}>
          Ingrese el ruc y aguarde la busqueda
        </FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledTaxPayerId;
