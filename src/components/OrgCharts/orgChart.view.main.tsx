import { Button, HStack, Icon, useDisclosure, VStack } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineAdd } from 'react-icons/md';
import { Tree, TreeNode } from 'react-organizational-chart';
import { trpcClient } from '../../lib/utils/trpcClient';
import CreateBankAccountModal from '../Modals/bankAcc.create.modal';
import CreateOrgModal from '../Modals/org.create.modal';
import ErrorBotLottie from '../Spinners-Loading/ErrorBotLottie';
import LoadingPlantLottie from '../Spinners-Loading/LoadiingPlantLottie';
import BankAccCard from './Cards/bankAcc.card';
import OrgCard from './Cards/org.card';

const MainOverview = () => {
  const { data: orgs, isLoading, error } = trpcClient.org.getMany.useQuery();
  const {
    data: bankAccs,
    isLoading: isBankLoading,
    error: isBankError,
  } = trpcClient.bankAcc.getMany.useQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: bankAccIsOpen,
    onOpen: onBankAccOpen,
    onClose: onBankAccClose,
  } = useDisclosure();

  return (
    <VStack>
      <HStack alignSelf={'end'}>
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
        <CreateBankAccountModal
          isOpen={bankAccIsOpen}
          onClose={onBankAccClose}
        />
      </HStack>
      {!isBankLoading && (
        <HStack>
          {bankAccs?.map((bankAcc) => (
            <BankAccCard key={bankAcc.id} {...bankAcc} />
          ))}
        </HStack>
      )}
      {!isLoading && (
        <HStack>
          {orgs?.map((org) => (
            <Tree
              key={org.id}
              label={<OrgCard displayName={org.displayName} id={org.id} />}
            >
              <TreeNode label={<div>Child 1</div>}>
                <TreeNode label={<div>Grand Child</div>} />
              </TreeNode>
            </Tree>
          ))}
        </HStack>
      )}

      {isLoading && <LoadingPlantLottie />}
      {error && <ErrorBotLottie />}
    </VStack>
  );
};

export default MainOverview;
