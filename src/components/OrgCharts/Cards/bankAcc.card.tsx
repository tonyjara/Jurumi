import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Box,
  Container,
  Text,
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
  translateBankNames,
  translateCurrency,
} from '../../../lib/utils/TranslatedEnums';
import EditBankAccModal from '../../Modals/moneyAcc.edit.modal';
import type { MoneyAccWithBankInfo } from '../../../lib/validations/moneyAcc.validate';

const BankAccCard = (bankAcc: MoneyAccWithBankInfo) => {
  const context = trpcClient.useContext();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { mutate, isLoading } = trpcClient.moneyAcc.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'La cuenta ha sido eliminada! 💩',
      callback: () => {
        context.moneyAcc.getManyBankAccs.invalidate();
      },
    })
  );
  const deleteBankAcc = () => {
    mutate({ id: bankAcc.id });
  };

  return (
    <Container maxW={'280px'}>
      <Card>
        <CardHeader pb={0}>
          <Heading size="md">{bankAcc.displayName}</Heading>
          <Heading size={'sm'}>
            {' '}
            {`${translateBankNames(
              bankAcc.bankInfo?.bankName
            )} ${translateCurrency(bankAcc.currency)}`}{' '}
          </Heading>
        </CardHeader>

        <CardBody>
          <Box textAlign={'left'}>
            <Heading size="md">
              {decimalFormat(bankAcc.initialBalance, bankAcc.currency)}
            </Heading>
            <VStack whiteSpace={'nowrap'} spacing={0}>
              <Text>Titular: {bankAcc.bankInfo?.ownerName} </Text>
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
                aria-label={'Delete bankAcc'}
                size="sm"
                onClick={deleteBankAcc}
                disabled={isLoading}
              />
            </HStack>
          </Box>
        </CardBody>
      </Card>

      <EditBankAccModal
        accData={bankAcc}
        isOpen={isEditOpen}
        onClose={onEditClose}
      />
    </Container>
  );
};

export default BankAccCard;
