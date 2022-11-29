import { HStack, Icon, useDisclosure, Button } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineAdd } from 'react-icons/md';
import CreateBankAccountModal from '../../../components/Modals/bankAcc.create.modal';
import CreateOrgModal from '../../../components/Modals/org.create.modal';

const CreateModalButtons = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: bankAccIsOpen,
    onOpen: onBankAccOpen,
    onClose: onBankAccClose,
  } = useDisclosure();
  return (
    <HStack
      p={'10px'}
      backgroundColor={'gray.900'}
      zIndex={2}
      position={'absolute'}
      right={0}
    >
      <Button
        onClick={onOpen}
        rightIcon={<Icon boxSize={6} as={MdOutlineAdd} />}
        aria-label={'Add Org'}
        size="sm"
        alignSelf={'end'}
      >
        Crear Org
      </Button>
      <CreateOrgModal isOpen={isOpen} onClose={onClose} />
      <Button
        onClick={onBankAccOpen}
        rightIcon={<Icon boxSize={6} as={MdOutlineAdd} />}
        aria-label={'Add bank acc'}
        size="sm"
        alignSelf={'end'}
      >
        Crear Cuenta Bancaria
      </Button>
      <CreateBankAccountModal isOpen={bankAccIsOpen} onClose={onBankAccClose} />
    </HStack>
  );
};

export default CreateModalButtons;
