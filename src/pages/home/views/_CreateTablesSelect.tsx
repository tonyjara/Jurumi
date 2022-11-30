import { HStack, useDisclosure, Box } from '@chakra-ui/react';
import React from 'react';
import CreateBankAccountModal from '../../../components/Modals/bankAcc.create.modal';
import CreateOrgModal from '../../../components/Modals/org.create.modal';
import { Select } from 'chakra-react-select';
import CreatePettyCashModal from '../../../components/Modals/pettyCash.create.modal';

const CreateTablesSelect = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: bankAccIsOpen,
    onOpen: onBankAccOpen,
    onClose: onBankAccClose,
  } = useDisclosure();
  const {
    isOpen: isPettyCashOpen,
    onOpen: onPettyCashOpen,
    onClose: onPettyCashClose,
  } = useDisclosure();

  const selectOptions = [
    { label: 'Crear Org', value: 'org' },
    { label: 'Crear Cuenta Bancaria', value: 'bankAcc' },
    { label: 'Crear Caja Chica', value: 'pettyCash' },
  ];
  const handleOnChange = (x: 'bankAcc' | 'org' | 'pettyCash' | undefined) => {
    if (!x) return;
    const dict = {
      bankAcc: onBankAccOpen,
      org: onOpen,
      pettyCash: onPettyCashOpen,
    };
    dict[x]();
  };

  return (
    <HStack
      p={'10px'}
      backgroundColor={'gray.900'}
      zIndex={2}
      position={'absolute'}
      right={0}
    >
      <Box minW={'300px'}>
        <Select
          value={{ value: '', label: 'Seleccione para crear' }}
          options={selectOptions}
          onChange={(e: any) => handleOnChange(e?.value)}
          noOptionsMessage={() => ''}
          placeholder="Seleccione para crear."
        />
      </Box>
      <CreateOrgModal isOpen={isOpen} onClose={onClose} />
      <CreateBankAccountModal isOpen={bankAccIsOpen} onClose={onBankAccClose} />
      <CreatePettyCashModal
        isOpen={isPettyCashOpen}
        onClose={onPettyCashClose}
      />
    </HStack>
  );
};

export default CreateTablesSelect;
