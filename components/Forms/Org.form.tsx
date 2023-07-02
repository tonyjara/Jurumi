import { VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from "react-hook-form";

import { trpcClient } from "../../lib/utils/trpcClient";
import type { FormOrganization } from "../../lib/validations/org.validate";
import FormControlledImageUpload from "../FormControlled/FormControlledImageUpload";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import FormControlledText from "../FormControlled/FormControlledText";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  //TODO: solve why we cant use nested object in errors.
  errors: FieldErrorsImpl<any>;

  setValue: UseFormSetValue<T>;
}

const OrgForm = ({
  control,
  errors,
  setValue,
}: formProps<FormOrganization>) => {
  const user = useSession().data?.user;
  const { data: activeUsers } =
    trpcClient.account.getAllActiveInThisOrg.useQuery();
  const usersAsOptions = activeUsers?.map((user) => ({
    displayName: `${user.displayName}`,
    id: user.id,
  }));

  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="displayName"
        label="Nombre de su organización"
        autoFocus={true}
      />
      <FormControlledSelect
        isMulti
        control={control}
        errors={errors as any}
        name="moneyRequestApprovers"
        label="Seleccione uno o mas encargados de aprobar las solicitudes de dinero"
        options={usersAsOptions ?? []}
        helperText={
          "Al elegir miembros todas las solicitudes deberán ser aprobadas por ellos antes de poder ser procesadas."
        }
        optionLabel={"displayName"}
        optionValue={"id"}
      />
      <FormControlledSelect
        isMulti
        control={control}
        errors={errors as any}
        name="moneyAdministrators"
        label="Seleccione uno o mas encargados de ejecutar las solicitudes de dinero"
        options={usersAsOptions ?? []}
        helperText={
          "Solo los miembros seleccionados prodrán ejecutar transacciones. Al dejar vacio cualquier moderador podra ejecutar transacciones."
        }
        optionLabel={"displayName"}
        optionValue={"id"}
      />

      <FormControlledNumberInput
        control={control}
        errors={errors}
        name="dolarToGuaraniExchangeRate"
        label="Tasa de cambio"
        helperText={"Un dolar equivale a X guaranies."}
      />
      {user && (
        <FormControlledImageUpload
          control={control}
          errors={errors}
          urlName="imageLogo.url"
          idName="imageLogo.imageName"
          label="Logo de la organización"
          setValue={setValue}
          helperText=""
          userId={user.id}
        />
      )}
    </VStack>
  );
};

export default OrgForm;
