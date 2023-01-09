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
  useDisclosure,
  FormHelperText,
} from '@chakra-ui/react';
import axios from 'axios';
import type { DropdownIndicatorProps, GroupBase } from 'chakra-react-select';
import { Select, components } from 'chakra-react-select';
import { startCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldErrorsImpl,
  FieldValues,
  Path,
  SetFieldValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import useDebounce from '../../lib/hooks/useDebounce';
import { trpcClient } from '../../lib/utils/trpcClient';
import CreateTaxPayerModal from '../Modals/taxPayer.create.modal';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  rucName: Path<T>;
  razonSocialName: Path<T>;
  autoFocus?: boolean;
  setValue: SetFieldValue<T>;
  helperText?: string;
}
export interface datosPyResponse {
  razonsocial: string;
  documento: string;
  dv: string;
}

// This component takes in the names of inputs RUC and RAZONSOCIAL, then after user write more than 5 numbers it makes a search query first on the database and then on the datospy api to find the contribuyente. If both fail to locate user, then you can create the user manually and afterwards it gets autmoaticly added to the form in wich this component is present.

const FormControlledTaxPayerId = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const {
    control,
    rucName,
    razonSocialName,
    errors,
    autoFocus,
    setValue,
    helperText,
  } = props;
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectInput, setSelectInput] = useState('');
  const [selectOptions, setSelectOptions] = useState<
    { value: string; label: string }[] | null
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const debouncedSearchValue = useDebounce(selectInput, 500);
  const controller = new AbortController();

  //Full text search of the users ruc inside DB.
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

  //Fetches contribuyentes from datospy, if req is ok, list is disoplayed as options on select.
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

  const handleOnSelect = (
    e: any | { value: string; label: string } | undefined,
    field: ControllerRenderProps<T, Path<T>>
  ) => {
    field.onChange(e?.value ?? '');
    setValue(razonSocialName, e?.label ?? '');
  };

  const handleSetRucAndRazonSocial = ({
    ruc,
    razonSocial,
  }: {
    ruc: string;
    razonSocial: string;
  }) => {
    setValue(rucName, ruc);
    setValue(razonSocialName, razonSocial);
    setSelectOptions([{ value: ruc, label: razonSocial }]);
  };

  const ruc = useWatch({ control, name: rucName });
  const razonSocial = useWatch({ control, name: razonSocialName });

  useEffect(() => {
    setSelectOptions([
      ...(selectOptions ?? []),
      { value: ruc, label: razonSocial },
    ]);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormControl isInvalid={!!errors[rucName]}>
        <FormLabel fontSize={'md'} color={'gray.500'}>
          Contribuyente
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
                  onChange={(e) => handleOnSelect(e, field)}
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

          <IconButton onClick={onOpen} aria-label={'Add user '}>
            <AddIcon />
          </IconButton>
        </HStack>
        {!selectOptions && !loading && (
          <Text color="red.300">
            No hemos encontrado un contribuyente con ese ruc, favor cree uno y
            regrese.
          </Text>
        )}
        {!errors[rucName] ? (
          <FormHelperText color={'gray.500'}>{helperText}</FormHelperText>
        ) : (
          //@ts-ignore
          <FormErrorMessage>{errors[rucName].message}</FormErrorMessage>
        )}
      </FormControl>
      <CreateTaxPayerModal
        //sets ruc and razonsocial on success
        handleSetRucAndRazonSocial={handleSetRucAndRazonSocial}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default FormControlledTaxPayerId;
