import { HStack, useDisclosure, Box } from '@chakra-ui/react';
import React from 'react';
import CreateMoneyAccModal from '../../../components/Modals/MoneyAcc.create.modal';
import CreateOrgModal from '../../../components/Modals/org.create.modal';
import { Select } from 'chakra-react-select';
import CreateAccountModal from '../../../components/Modals/account.create.modal';

const CreateTablesSelect = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: moneyAccIsOpen,
    onOpen: onMoneyAccOpen,
    onClose: onMoneyAccClose,
  } = useDisclosure();
  const {
    isOpen: accountIsOpen,
    onOpen: onAccountOpen,
    onClose: onAccountClose,
  } = useDisclosure();

  const selectOptions = [
    { label: 'Crear Org', value: 'org' },
    { label: 'Crear Cuenta o Caja chica', value: 'moneyAcc' },
    { label: 'Crear un usuario', value: 'account' },
  ];
  const handleOnChange = (x: 'moneyAcc' | 'org' | undefined) => {
    if (!x) return;
    const dict = {
      moneyAcc: onMoneyAccOpen,
      org: onOpen,
      account: onAccountOpen,
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
      <CreateAccountModal isOpen={accountIsOpen} onClose={onAccountClose} />
    </HStack>
  );
};

export default CreateTablesSelect;
