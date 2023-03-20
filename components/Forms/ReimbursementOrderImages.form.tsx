import type { FormMoneyRequest } from '@/lib/validations/moneyRequest.validate';
import { defaultReimbursementOrderSearchableImage } from '@/lib/validations/moneyRequest.validate';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Divider, Flex, IconButton, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import FormControlledFacturaNumber from '../FormControlled/FormControlledFacturaNumber';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const ReimbursementOrderImagesForm = ({
  control,
  errors,
  setValue,
}: formProps<FormMoneyRequest>) => {
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'searchableImages',
  });
  const user = useSession().data?.user;

  return (
    <>
      <Divider my={'10px'} />
      <Flex width={'100%'} alignItems="center" justifyContent={'space-between'}>
        <Text fontSize={'lg'} fontWeight="bold">
          {' '}
          Comprobantes
        </Text>
        <Button
          isDisabled={imageIsLoading}
          onClick={() => prepend(defaultReimbursementOrderSearchableImage)}
          aria-label="add"
          rightIcon={<AddIcon />}
        >
          Agregar otro comprobante
        </Button>
      </Flex>
      {fields.map((x, index) => {
        const errorForField = errors?.searchableImages?.[index];
        return (
          <Flex flexDir={'column'} mt="10px" key={x.id} width="100%" gap={5}>
            <Flex width={'100%'} alignItems="center" gap={'10px'}>
              <FormControlledFacturaNumber
                control={control}
                errors={errors}
                name={`searchableImages.${index}.facturaNumber`}
                label={`${index + 1}) Número de factura. `}
                error={errorForField?.facturaNumber?.message}
              />
              <IconButton
                onClick={() => remove(index)}
                aria-label="delete images"
                icon={<DeleteIcon />}
                marginTop="22px"
              />
            </Flex>
            {user && (
              <FormControlledImageUpload
                setImageIsLoading={setImageIsLoading}
                control={control}
                errors={errors}
                urlName={`searchableImages.${index}.url`}
                idName={`searchableImages.${index}.imageName`}
                label="Foto de su comprobante"
                setValue={setValue}
                userId={user.id}
                helperText="Favor tener en cuenta la orientación y legibilidad del documento."
                error={errorForField?.imageName?.message}
              />
            )}

            <Divider />
          </Flex>
        );
      })}
    </>
  );
};

export default ReimbursementOrderImagesForm;
