// This component handles everythinf so that looking for a taxpayer from datospy or our own database is a smooth process.

import { startCase } from "@/lib/utils/MyLodash";
import {
  bankNameOptions,
  ownerDocTypeOptions,
} from "@/lib/utils/SelectOptions";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
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
  Divider,
  Box,
  Flex,
} from "@chakra-ui/react";
import type { TaxPayer, TaxPayerBankInfo } from "@prisma/client";
import axios from "axios";
import type { DropdownIndicatorProps, GroupBase } from "chakra-react-select";
import { Select, components } from "chakra-react-select";
import React, { useEffect, useState } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
  SetFieldValue,
  UseFormGetValues,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { AiOutlineMinusSquare } from "react-icons/ai";
import useDebounce from "../../lib/hooks/useDebounce";
import { trpcClient } from "../../lib/utils/trpcClient";
import CreateTaxPayerModal, {
  CreateTaxPayerModalSetFuncProps,
} from "../Modals/taxPayer.create.modal";
import FormControlledSelect from "./FormControlledSelect";
import FormControlledText from "./FormControlledText";
import { defaultBankInfo } from "@/lib/validations/moneyRequest.validate";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  rucName: Path<T>;
  getValues: UseFormGetValues<T>;
  razonSocialName: Path<T>;
  autoFocus?: boolean;
  setValue: SetFieldValue<T>;
  helperText?: string;
  label?: string;
  showBankInfo?: boolean;
  bankInfoName?: string;
}
export interface datosPyResponse {
  razonsocial: string;
  documento: string;
  dv: string;
}

// This component takes in the names of inputs RUC and RAZONSOCIAL, then after user write more than 5 numbers it makes a search query first on the database, if the show bankinfo flag is on, if the taxpayer is found on the database it sets all found taxpayers as a list so that its bank info can be set later. and then on the datospy api to find the contribuyente. If both fail to locate user, then you can create the user manually and afterwards it gets autmoaticly added to the form in wich this component is present.

type FetctchedTaxPayers = (TaxPayer & {
  bankInfo: TaxPayerBankInfo | null;
})[];

interface TaxPayerSelectOption {
  value: string;
  label: string;
  razonSocial: string;
  id: string | null;
}

const FormControlledTaxPayerId = <T extends FieldValues>(
  props: InputProps<T>,
) => {
  const {
    control,
    rucName,
    razonSocialName,
    errors,
    autoFocus,
    setValue,
    helperText,
    label,
    showBankInfo,
    bankInfoName,
    getValues,
  } = props;
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectInput, setSelectInput] = useState("");
  const [selectOptions, setSelectOptions] = useState<
    TaxPayerSelectOption[] | null
  >([]);
  const [fetchedTaxPayers, setFetchedTaxPayers] = useState<FetctchedTaxPayers>(
    [],
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isFadeOpen, onToggle: onFadeToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const debouncedSearchValue = useDebounce(selectInput, 500);
  const controller = new AbortController();

  //Full text search of the users ruc inside DB.
  const { isFetching: isFetchingFindData } =
    trpcClient.taxPayer.findFullTextSearch.useQuery(
      { searchValue: debouncedSearchValue, filterValue: "ruc" },
      {
        refetchOnWindowFocus: false,
        enabled: debouncedSearchValue.length > 4,
        onSuccess: async (x) => {
          if (!x) return;
          if (!x.length) {
            return getDataFromDatosPy(debouncedSearchValue);
          }

          const convertToSelect: TaxPayerSelectOption[] = x.map((y) => ({
            value: y.ruc,
            label: y.fantasyName?.length
              ? `(${y.fantasyName}) - ${y.razonSocial}`
              : y.razonSocial,
            razonSocial: y.razonSocial,
            id: y.id,
          }));
          showBankInfo && setFetchedTaxPayers(x);
          setSelectOptions(convertToSelect);
          setOpenDropdown(true);
        },
      },
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
        },
      );
      if (status !== 200) throw "not 200";
      const datosFrompy = data as datosPyResponse[];

      const options: TaxPayerSelectOption[] = datosFrompy.map((x) => ({
        label: startCase(x.razonsocial.toLowerCase()),
        razonSocial: startCase(x.razonsocial.toLowerCase()),
        value: `${x.documento}-${x.dv}`,
        id: null,
      }));
      setSelectOptions(options);
      setOpenDropdown(true);

      setLoading(false);
    } catch (err) {
      console.error(err);
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
      DropdownIndicatorProps<unknown, boolean, GroupBase<unknown>>,
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <Spinner />
      </components.DropdownIndicator>
    );
  };

  const handleOnSelect = (
    e: any | TaxPayerSelectOption | undefined,
    field: ControllerRenderProps<T, Path<T>>,
  ) => {
    field.onChange(e?.value ?? "");
    setValue(razonSocialName, e?.label ?? "");
    setValue("taxPayer.id", e?.id ?? "");

    if (showBankInfo && fetchedTaxPayers.length && e?.value) {
      const foundBankInfo = fetchedTaxPayers.find(
        (x) => x.id === e.id,
      )?.bankInfo;

      if (!foundBankInfo) {
        setValue(
          bankInfoName ? `${bankInfoName}.bankInfo` : "taxPayer.bankInfo",
          defaultBankInfo,
        );
        return;
      }
      setValue(
        bankInfoName ? `${bankInfoName}.bankInfo` : "taxPayer.bankInfo",
        foundBankInfo,
      );
    }
  };

  const handleSetRucAndRazonSocialAfterCreate = ({
    ruc,
    razonSocial,
    id,
    label,
  }: CreateTaxPayerModalSetFuncProps) => {
    setValue(rucName, ruc);
    setValue("taxPayer.id", id);
    setValue(razonSocialName, razonSocial);
    setSelectOptions([{ value: ruc, label, razonSocial, id }]);
  };

  // const ruc = useWatch({ control, name: rucName });
  // const razonSocial = useWatch({ control, name: razonSocialName });

  //This is used to set initial option on edit
  //TODO: Make this tighter
  useEffect(() => {
    const values = getValues();
    const taxPayer = values?.taxPayer;
    if (!taxPayer) return;

    setSelectOptions((prev) => [
      ...(prev ?? []),
      {
        value: taxPayer?.ruc,
        label: taxPayer?.fantasyName
          ? `(${taxPayer.fantasyName}) - ${taxPayer.razonSocial}`
          : taxPayer?.razonSocial,
        razonSocial: taxPayer.razonSocial,
        id: taxPayer.id,
      },
    ]);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rucNameSplit = rucName.split(".");
  const taxPayerString = rucNameSplit[0];
  const rucString = rucNameSplit[1];
  const taxPayerError =
    (taxPayerString &&
      rucString &&
      errors[taxPayerString] &&
      errors[taxPayerString][rucString]) ??
    "";

  return (
    <>
      <FormControl isInvalid={!!taxPayerError}>
        <FormLabel
          fontSize={"md"}
          color={"gray.600"}
          _dark={{ color: "gray.400" }}
        >
          {label ?? "Contribuyente"}
        </FormLabel>
        <HStack>
          <Controller
            control={control}
            name={rucName}
            render={({ field }) => (
              <div style={{ width: "90%" }}>
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
                  noOptionsMessage={() => "No hay opciones."}
                  placeholder={
                    <span>
                      <Search2Icon h={"30px"} fontSize="lg" /> Ingrese un ruc y
                      aguarde la busqueda
                    </span>
                  }
                  isClearable
                />
              </div>
            )}
          />

          <IconButton onClick={onOpen} aria-label={"Add user "}>
            <AddIcon />
          </IconButton>
        </HStack>
        {!selectOptions && !loading && (
          <Text color="red.300">
            No hemos encontrado un contribuyente con ese ruc, favor cree uno y
            regrese.
          </Text>
        )}
        {!taxPayerError.message ? (
          <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
        ) : (
          //@ts-ignore
          <FormErrorMessage>{taxPayerError.message}</FormErrorMessage>
        )}
      </FormControl>
      {showBankInfo && (
        <>
          <Divider />
          <Flex alignItems={"center"} gap="10px" alignSelf={"start"}>
            <IconButton
              size={"sm"}
              icon={<AiOutlineMinusSquare />}
              aria-label="bank info toggle"
              onClick={onFadeToggle}
            />

            <Text color="gray.500">Datos para transferencia</Text>
          </Flex>
          <Box
            style={{ width: "100%", display: isFadeOpen ? "block" : "none" }}
          >
            <FormControlledSelect
              control={control}
              errors={errors}
              error={
                bankInfoName
                  ? errors[bankInfoName]?.bankInfo?.bankName?.message
                  : errors.taxPayer?.bankInfo?.bankName?.message
              }
              //@ts-ignore
              name={
                bankInfoName
                  ? `${bankInfoName}.bankInfo.bankName`
                  : "taxPayer.bankInfo.bankName"
              }
              label="Seleccione el banco"
              options={bankNameOptions}
            />
            <FormControlledText
              control={control}
              errors={errors}
              //@ts-ignore
              name={
                bankInfoName
                  ? `${bankInfoName}.bankInfo.ownerName`
                  : "taxPayer.bankInfo.ownerName"
              }
              label="Denominación"
              autoFocus={true}
              //@ts-ignore
              error={
                bankInfoName
                  ? errors[bankInfoName]?.bankInfo?.ownerName?.message
                  : errors.taxPayer?.bankInfo?.ownerName?.message
              }
            />
            <FormControlledText
              control={control}
              errors={errors}
              //@ts-ignore
              name={
                bankInfoName
                  ? `${bankInfoName}.bankInfo.accountNumber`
                  : "taxPayer.bankInfo.accountNumber"
              }
              label="Número de cuenta"
              //@ts-ignore
              error={
                bankInfoName
                  ? errors[bankInfoName]?.bankInfo?.accountNumber?.message
                  : errors.taxPayer?.bankInfo?.accountNumber?.message
              }
            />
            <FormControlledSelect
              control={control}
              errors={errors}
              error={
                bankInfoName
                  ? errors[bankInfoName]?.bankInfo?.ownerDocType?.message
                  : errors.taxPayer?.bankInfo?.ownerDocType?.message
              }
              //@ts-ignore
              name={
                bankInfoName
                  ? `${bankInfoName}.bankInfo.ownerDocType`
                  : "taxPayer.bankInfo.ownerDocType"
              }
              label="Tipo de documento"
              options={ownerDocTypeOptions}
            />
            <FormControlledText
              control={control}
              errors={errors}
              //@ts-ignore
              name={
                bankInfoName
                  ? `${bankInfoName}.bankInfo.ownerDoc`
                  : "taxPayer.bankInfo.ownerDoc"
              }
              label="Documento del titular"
              //@ts-ignore
              error={
                bankInfoName
                  ? errors[bankInfoName]?.bankInfo?.ownerDoc?.message
                  : errors.taxPayer?.bankInfo?.ownerDoc?.message
              }
            />
            <Divider pb={"10px"} />
          </Box>
        </>
      )}
      <CreateTaxPayerModal
        //sets ruc and razonsocial on success
        handleSetRucAndRazonSocialAfterCreate={
          handleSetRucAndRazonSocialAfterCreate
        }
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default FormControlledTaxPayerId;
