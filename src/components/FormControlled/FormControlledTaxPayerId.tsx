// This component handles everythinf so that looking for a taxpayer from datospy or our own database is a smooth process.

import { AddIcon, Search2Icon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
  Text,
  Flex,
  Button,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import type { DropdownIndicatorProps, GroupBase } from 'chakra-react-select';
import { Select, components } from 'chakra-react-select';
import { debounce } from 'lodash';
import Link from 'next/link';
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
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectInput, setSelectInput] = useState('');
  const [selectOptions, setSelectOptions] = useState<
    { value: string; label: string }[] | null
  >([]);

  const watchTaxpayerId = useWatch({ control, name });
  const controller = new AbortController();

  const getDataFromDatosPy = async (id: string) => {
    try {
      setLoading(true);
      const { data, status } = await axios(
        `https://rucs.datospy.org/api/${id}`,
        {
          timeout: 5000,
          signal: controller.signal,
        }
      );
      if (status !== 200) throw 'not 200';
      const datosFrompy = data as datosPyResponse[];

      const options = datosFrompy.map((x) => ({
        label: x.razonsocial,
        value: `${x.documento}-${x.dv}`,
      }));
      setSelectOptions(options);
      setOpenDropdown(true);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setSelectOptions(null);
    }
  };

  const debouncedQuery = debounce(
    async () => getDataFromDatosPy(watchTaxpayerId),
    500
  );

  useEffect(() => {
    const hasOnlyLetters = /^[a-zA-Z]+$/.test(selectInput);

    if (selectInput.length > 5 && !hasOnlyLetters) {
      debouncedQuery();
    }

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectInput]);

  const handleInputChange = (e: any) => {
    if (openDropdown) setOpenDropdown(false);
    if (!selectOptions) setSelectOptions([]);
    return e && setSelectInput(e);
  };

  const DropdownIndicator = (
    props: JSX.IntrinsicAttributes &
      DropdownIndicatorProps<unknown, boolean, GroupBase<unknown>>
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <Spinner />
      </components.DropdownIndicator>
    );
  };

  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        Ruc del contribuyente
      </FormLabel>
      <HStack>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <div style={{ width: '90%' }}>
              <Select
                autoFocus={autoFocus}
                menuIsOpen={openDropdown}
                instanceId={name}
                components={{
                  DropdownIndicator: loading ? DropdownIndicator : undefined,
                }}
                options={selectOptions ?? []}
                onInputChange={(e) => {
                  handleInputChange(e);
                }}
                onChange={(e: any) => {
                  field.onChange(e?.value ?? '');
                }}
                value={selectOptions?.find((x) => x.value === field.value)}
                noOptionsMessage={() => 'No hay opciones.'}
                placeholder={
                  <span>
                    <Search2Icon h={'30px'} fontSize="lg" /> Ingrese un ruc y
                    aguarde la busqueda
                  </span>
                }
                isClearable
              />
            </div>
          )}
        />
        <Link href={'/home/taxpayers/create'}>
          <IconButton aria-label={'Add user '}>
            <AddIcon />
          </IconButton>
        </Link>
      </HStack>
      {!selectOptions && !loading && (
        <Text color="red.300">
          No hemos encontrado un contribuyente con ese ruc, favor cree uno y
          regrese.
        </Text>
      )}
      {errors[name] && (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledTaxPayerId;
