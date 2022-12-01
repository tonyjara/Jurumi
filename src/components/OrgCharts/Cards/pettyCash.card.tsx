import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Box,
  Container,
  Icon,
  Divider,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../../Toasts/MyToast';
import {
  decimalFormat,
  translateCurrency,
} from '../../../lib/utils/TranslatedEnums';
import type { MoneyAccount } from '@prisma/client';
import EditMoneyAccModal from '../../Modals/moneyAcc.edit.modal';

const PettyCashCard = (pettyCash: MoneyAccount) => {
  const context = trpcClient.useContext();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { mutate, isLoading } = trpcClient.moneyAcc.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'La caja chica ha sido eliminada! 💩',
      callback: () => {
        context.moneyAcc.getManyCashAccs.invalidate();
      },
    })
  );
  const deleteMutation = () => {
    mutate({ id: pettyCash.id });
  };

  return (
    <Container maxW={'280px'}>
      <Card>
        <CardHeader pb={0}>
          <Heading size="md">{pettyCash.displayName}</Heading>
          <Heading size={'sm'}>{translateCurrency(pettyCash.currency)}</Heading>
        </CardHeader>

        <CardBody>
          <Box>
            <Heading size="md">
              {decimalFormat(pettyCash.initialBalance, pettyCash.currency)}
            </Heading>
            <VStack whiteSpace={'nowrap'} textAlign={'left'} spacing={0}>
              {/* <Text>Titular: {bankAcc.ownerName}</Text> */}
            </VStack>
            <Divider mb={2} mt={2} />
            <HStack justifyContent={'end'}>
              <IconButton
                onClick={onEditOpen}
                icon={<Icon boxSize={6} as={MdOutlineEdit} />}
                aria-label={'Edit BankAcc'}
                size="sm"
              />
              <IconButton
                icon={<Icon boxSize={6} as={MdOutlineDelete} />}
                aria-label={'Delete pettyCash'}
                size="sm"
                onClick={deleteMutation}
                disabled={isLoading}
              />
            </HStack>
          </Box>
        </CardBody>
      </Card>

      <EditMoneyAccModal
        accData={pettyCash}
        isOpen={isEditOpen}
        onClose={onEditClose}
      />
    </Container>
  );
};

export default PettyCashCard;
