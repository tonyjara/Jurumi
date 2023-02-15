import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import { trpcClient } from '@/lib/utils/trpcClient';
import Emoji from 'react-emoji-render';
import {
  Box,
  Card,
  List,
  ListItem,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import Link from 'next/link';
import WelcomeScreenModal from '@/components/Modals/welcomeScreen.modal';
import { useEffect } from 'react';

const HomePage = () => {
  const {
    isOpen: isWelcomeModalOpen,
    onOpen: onWelcomeModalOpen,
    onClose: onWelcomeModalClose,
  } = useDisclosure();

  const { data } = trpcClient.moneyRequest.countMyPendingRequests.useQuery();
  const { data: slackAnnouncements } =
    trpcClient.notifications.getSlackAnnouncements.useQuery();
  const { data: prefs } = trpcClient.preferences.getHomePreferences.useQuery();

  useEffect(() => {
    if (!prefs) return;
    if (prefs.hasSeenWelcomeScreen && isWelcomeModalOpen) {
      onWelcomeModalClose();
    }
    if (!isWelcomeModalOpen && !prefs.hasSeenWelcomeScreen) {
      onWelcomeModalOpen();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs]);

  const listItemBg = useColorModeValue('#EDF2F7', '#4A5568');
  return (
    <Box alignItems={'center'} display={'flex'} flexDir="column" w={'100%'}>
      <Text fontSize={{ base: '3xl', md: '5xl' }}>Bienvenido a Jurumi</Text>
      <Card w={'100%'} maxW={'800px'} mb={'20px'}>
        <Text m={'10px'} fontWeight={'bold'} fontSize={'2xl'}>
          Anuncios
        </Text>
        <List overflow="auto" maxH={'250px'} spacing={3}>
          {slackAnnouncements?.map((x) => (
            <ListItem
              backgroundColor={listItemBg}
              borderRadius={'8px'}
              p="10px"
              key={x.ts}
              m="5px"
            >
              <Text fontSize={{ base: 'xl', md: '2xl' }}>
                <Emoji>{x?.text ?? ''}</Emoji>
              </Text>
            </ListItem>
          ))}
        </List>
      </Card>

      <Card w={'100%'} maxW={'800px'}>
        <Text m={'10px'} fontWeight={'bold'} fontSize={'2xl'}>
          Solicitudes pendientes
        </Text>

        {data && (
          <Text m={'10px'} fontSize={'xl'}>
            Tienes {data.length} Solicitudes pendientes
          </Text>
        )}
        <Link href={'/home/requests'}>
          <List maxH={'250px'} overflow="auto" spacing={3}>
            {data?.map((req) => (
              <ListItem
                backgroundColor={listItemBg}
                borderRadius={'8px'}
                p="10px"
                m="5px"
                _hover={{ bg: 'teal', cursor: 'pointer' }}
                key={req.id}
              >
                <Text fontSize={{ base: 'xl', md: '2xl' }}>
                  {format(req.createdAt, 'dd/MM/yy')} por monto{' '}
                  {decimalFormat(req.amountRequested, req.currency)}
                </Text>
              </ListItem>
            ))}
          </List>
        </Link>
      </Card>
      <WelcomeScreenModal
        isOpen={isWelcomeModalOpen}
        onClose={onWelcomeModalClose}
      />
    </Box>
  );
};

export default HomePage;
