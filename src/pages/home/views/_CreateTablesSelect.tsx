import { HStack, useDisclosure, Box } from '@chakra-ui/react';
import React from 'react';
import CreateMoneyAccModal from '../../../components/Modals/MoneyAcc.create.modal';
import CreateOrgModal from '../../../components/Modals/org.create.modal';
import { Select } from 'chakra-react-select';

const CreateTablesSelect = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: moneyAccIsOpen,
    onOpen: onMoneyAccOpen,
    onClose: onMoneyAccClose,
  } = useDisclosure();

  const selectOptions = [
    { label: 'Crear Org', value: 'org' },
    { label: 'Crear Cuenta o Caja chica', value: 'moneyAcc' },
  ];
  const handleOnChange = (x: 'moneyAcc' | 'org' | undefined) => {
    if (!x) return;
    const dict = {
      moneyAcc: onMoneyAccOpen,
      org: onOpen,
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
          instanceId={'unique-id'}
          value={{ value: '', label: 'Seleccione para crear' }}
          options={selectOptions}
          onChange={(e: any) => handleOnChange(e?.value)}
          noOptionsMessage={() => ''}
          placeholder="Seleccione para crear."
        />
      </Box>
      <CreateOrgModal isOpen={isOpen} onClose={onClose} />
      <CreateMoneyAccModal isOpen={moneyAccIsOpen} onClose={onMoneyAccClose} />
    </HStack>
  );
};

export default CreateTablesSelect;
