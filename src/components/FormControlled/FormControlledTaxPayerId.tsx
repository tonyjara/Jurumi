// This component handles everythinf so that looking for a taxpayer from datospy or our own database is a smooth process.

import { AddIcon, Search2Icon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
  Text,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import type { DropdownIndicatorProps, GroupBase } from 'chakra-react-select';
import { Select, components } from 'chakra-react-select';
import { startCase } from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import type {
  Control,
  FieldErrorsImpl,
  FieldValues,
  Path,
  SetFieldValue,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import useDebounce from '../../lib/hooks/useDebounce';
import { trpcClient } from '../../lib/utils/trpcClient';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  rucName: Path<T>;
  razonSocialName: Path<T>;
  autoFocus?: boolean;
  setValue: SetFieldValue<T>;
}
export interface datosPyResponse {
  razonsocial: string;
  documento: string;
  dv: string;
}
const FormControlledTaxPayerId = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const { control, rucName, razonSocialName, errors, autoFocus, setValue } =
    props;
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectInput, setSelectInput] = useState('');
  const [selectOptions, setSelectOptions] = useState<
    { value: string; label: string }[] | null
  >([]);

  const debouncedSearchValue = useDebounce(selectInput, 500);

  const controller = new AbortController();

  const { isFetching: isFetchingFindData } =
    trpcClient.taxPayer.findFullTextSearch.useQuery(
      { ruc: debouncedSearchValue },
      {
        refetchOnWindowFocus: false,
        enabled: debouncedSearchValue.length > 4,
        onSuccess: async (x) => {
          if (!x) return;
          if (!x.length) {
            return getDataFromDatosPy(debouncedSearchValue);
          }

          const convertToSelect = x.map((y) => ({
            value: y.ruc,
            label: y.razonSocial,
          }));

          setSelectOptions(convertToSelect);
          setOpenDropdown(true);
        },
      }
    );

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
        label: startCase(x.razonsocial.toLowerCase()),
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
    <FormControl isInvalid={!!errors[rucName]}>
      <FormLabel fontSize={'md'} color={'gray.500'}>
        Ruc del contribuyente
      </FormLabel>
      <HStack>
        <Controller
          control={control}
          name={rucName}
          render={({ field }) => (
            <div style={{ width: '90%' }}>
              <Select
                autoFocus={autoFocus}
                menuIsOpen={openDropdown}
                instanceId={rucName}
                components={{
                  DropdownIndicator:
                    loading || isFetchingFindData
                      ? DropdownIndicator
                      : undefined,
                }}
                options={selectOptions ?? []}
                onInputChange={(e) => {
                  handleInputChange(e);
                }}
                onChange={(
                  e: any | { value: string; label: string } | undefined
                ) => {
                  field.onChange(e?.value ?? '');
                  setValue(razonSocialName, e?.label ?? '');
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
      {errors[rucName] && (
        //@ts-ignore
        <FormErrorMessage>{errors[rucName].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledTaxPayerId;
