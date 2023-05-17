import { Divider, VStack } from "@chakra-ui/react";
import React from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { memberTypeOptions } from "../../lib/utils/SelectOptions";
import { translateCurrencyPrefix } from "../../lib/utils/TranslatedEnums";
import { trpcClient } from "../../lib/utils/trpcClient";
import type { FormMoneyRequest } from "../../lib/validations/moneyRequest.validate";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import FormControlledText from "../FormControlled/FormControlledText";
import type { FormMember } from "@/lib/validations/member.validate";
import FormControlledDatePicker from "../FormControlled/FormControlledDatePicker";
import { FormBecomeMemberRequest } from "@/lib/validations/becomeMember.validate";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";
import FormControlledPhoneInput from "../FormControlled/FormControlledPhoneInput";
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  isEdit?: boolean;
}

const BecomeMemberForm = ({
  control,
  errors,
  setValue,
  isEdit,
}: formProps<FormBecomeMemberRequest>) => {
  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="fullName"
        label="Nombre completo"
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="email"
        label="Email "
      />
      <FormControlledText
        control={control}
        errors={errors}
        name={"documentId"}
        label="Cédula o pasaporte"
      />

      <FormControlledText
        control={control}
        errors={errors}
        name={"phoneNumber"}
        label="Número de celular"
      />
      <FormControlledDatePicker
        control={control}
        errors={errors}
        name={"birthDate"}
        label="Fecha de nacimiento"
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="nationality"
        label="Nacionalidad"
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="address"
        label="Dirección"
      />

      <FormControlledText
        control={control}
        errors={errors}
        name="occupation"
        label="Ocupación"
      />
    </VStack>
  );
};

export default BecomeMemberForm;
