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
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import { trpcClient } from '@/lib/utils/trpcClient';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { translateCurrency } from '@/lib/utils/TranslatedEnums';
import EditMoneyAccModal from '@/components/Modals/moneyAcc.edit.modal';
import { formatedAccountBalance } from '@/lib/utils/TransactionUtils';
import type { CashAccsWithLastTx } from '../CardGroups/PettyCash.cardGroup';

const PettyCashCard = (pettyCash: CashAccsWithLastTx) => {
  const context = trpcClient.useContext();
  const cardBackground = useColorModeValue('white', 'gray.700');
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { mutate, isLoading } = trpcClient.moneyAcc.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'La caja chica ha sido eliminada! 💩',
      callback: () => {
        context.moneyAcc.invalidate();
      },
    })
  );
  const deleteMutation = () => {
    mutate({ id: pettyCash.id });
  };

  return (
    <Container maxW={'280px'}>
      <Card backgroundColor={cardBackground}>
        <CardHeader pb={0}>
          <Heading size="md">{pettyCash.displayName}</Heading>
          <Heading size={'sm'}>{translateCurrency(pettyCash.currency)}</Heading>
        </CardHeader>

        <CardBody>
          <Box>
            <Heading size="md">
              {/* {decimalFormat(pettyCash.initialBalance, pettyCash.currency)} */}
              {formatedAccountBalance(pettyCash)}
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
                isDisabled={isLoading}
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
