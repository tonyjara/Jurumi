import { currencyOptions } from "@/lib/utils/SelectOptions";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { translateCurrencyPrefix } from "../../lib/utils/TranslatedEnums";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledText from "../FormControlled/FormControlledText";
import {
  FormContract,
  defaultContractPaymentsValues,
} from "@/lib/validations/createContract.validate";
import FormControlledDatePicker from "../FormControlled/FormControlledDatePicker";
import { TbBoxMultiple } from "react-icons/tb";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import Decimal from "decimal.js";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const ContractPaymentsForm = ({
  control,
  errors,
  setValue,
}: formProps<FormContract>) => {
  const [multiplier, setMultiplier] = React.useState<number | null>(1);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
    keyName: "form",
  });

  const currency = useWatch({
    control,
    name: "currency",
  });

  const watchedFields = useWatch({ control, name: "payments" });

  const total = watchedFields.reduce((acc, curr) => {
    return acc.add(curr.amount);
  }, new Decimal(0));

  const removeAll = () => {
    const length = fields.map((_, i) => i);
    remove(length);
  };

  const handlePrepend = () => {
    if (multiplier) {
      for (let i = 0; i < multiplier; i++) {
        let lastAmount =
          watchedFields[fields.length - 1]?.amount ?? new Decimal(0);

        append(
          defaultContractPaymentsValues({
            length: fields.length + i,
            amount: lastAmount,
            addedMonths: fields.length + i,
            firstPaymentDate: fields[0]?.dateDue,
          }),
        );
      }
      return;
    }
    let lastAmount = watchedFields[fields.length - 1]?.amount ?? new Decimal(0);
    return append(
      defaultContractPaymentsValues({
        length: fields.length,
        amount: lastAmount,
        addedMonths: fields.length,
        firstPaymentDate: fields[0]?.dateDue,
      }),
    );
  };

  return (
    <Flex w="full" flexDir={"column"}>
      <Divider my={"10px"} />
      <Flex alignItems={"center"} gap="20px" py={"20px"}>
        <Text fontSize={"lg"} fontWeight="bold">
          {" "}
          Cuotas o pagos
        </Text>
        <Button onClick={removeAll}>Borrar todo</Button>

        <InputGroup maxW={"200px"}>
          <InputLeftElement pointerEvents={"none"}>
            <TbBoxMultiple />
          </InputLeftElement>
          <Input
            value={multiplier ?? ""}
            onChange={(e) =>
              setMultiplier(
                isNaN(parseInt(e.target.value))
                  ? null
                  : parseInt(e.target.value),
              )
            }
            maxLength={2}
            placeholder={"Multiplicador"}
          />
        </InputGroup>
        <IconButton
          onClick={handlePrepend}
          aria-label="add"
          icon={<AddIcon color={"orange"} />}
        />
      </Flex>
      <Text py={"10px"} color={"orange"}>
        Para no cambiar precios uno a uno, al agregar una cuota, se repite el
        precio anterior.
        <br /> La fecha del primer pago es la fecha de inicio del contrato. Al
        resto de las fechas se les agrega un mes automaticamente.
      </Text>
      <Text py={"10px"} fontSize={"xl"}>
        Total: {decimalFormat(total, currency)} | Cuotas: {fields.length}
      </Text>
      {fields.map((x, index) => {
        const currency = watchedFields[index]?.currency;
        return (
          <Flex gap={"20px"} w="full" flexDir={"column"} mt="10px" key={x.form}>
            <Flex
              gap={"20px"}
              alignItems={"center"}
              w="full"
              justifyContent={"space-between"}
            >
              <FormControlledText
                control={control}
                errors={errors}
                name={`payments.${index}.name`}
                label={`${index + 1}- Nombre`}
              />
              <FormControlledDatePicker
                control={control}
                errors={errors}
                name={`payments.${index}.dateDue`}
                label="Fecha de pago"
              />
              <IconButton
                onClick={() => remove(index)}
                aria-label="delete"
                icon={<DeleteIcon />}
              />
            </Flex>

            <Flex
              gap={"20px"}
              alignItems={"center"}
              w="full"
              justifyContent={"space-between"}
            >
              <FormControlledRadioButtons
                control={control}
                errors={errors}
                name={`payments.${index}.currency`}
                label="Moneda"
                options={currencyOptions}
                onChangeMw={() => setValue(`payments.${index}.amount`, 0)}
              />
              <FormControlledMoneyInput
                control={control}
                errors={errors}
                name={`payments.${index}.amount`}
                label="Monto asignado."
                prefix={translateCurrencyPrefix(currency ?? "PYG")}
                currency={currency ?? "PYG"}
              />
              <IconButton
                background={"transparent"}
                color={"transparent"}
                aria-label="placeholder block for styling"
              />
            </Flex>

            <Divider />
          </Flex>
        );
      })}
    </Flex>
  );
};

export default ContractPaymentsForm;
