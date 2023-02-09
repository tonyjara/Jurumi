import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import { trpcClient } from '@/lib/utils/trpcClient';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  List,
  ListIcon,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import Link from 'next/link';
import { MdAnnouncement, MdPendingActions } from 'react-icons/md';

const HomePage = () => {
  const { data } = trpcClient.moneyRequest.countMyPendingRequests.useQuery();
  const { data: slackAnnouncements } =
    trpcClient.notifications.getSlackAnnouncements.useQuery();

  return (
    <div>
      <Text fontSize={{ base: '3xl', md: '5xl' }}>Bienvenido a Jurumi</Text>

      <List maxH={'150px'} overflow="auto" spacing={3}>
        {slackAnnouncements?.map((x) => (
          <ListItem key={x.ts}>
            <ListIcon as={MdAnnouncement} color="yellow.500" />
            <Text role={'img'}>{x.text}</Text>
          </ListItem>
        ))}
      </List>
      <Flex flexDir={{ base: 'column', md: 'row' }} gap={5}>
        <Card>
          <CardHeader fontWeight={'bold'} fontSize={'2xl'}>
            Solicitudes pendientes
          </CardHeader>
          <CardBody>
            {data && (
              <Text mb={'10px'} fontSize={'xl'}>
                Tienes {data.length} Solicitudes pendientes
              </Text>
            )}
            <Link href={'/home/requests'}>
              <List maxH={'150px'} overflow="auto" spacing={3}>
                {data?.map((req) => (
                  <ListItem
                    _hover={{ bg: 'teal', cursor: 'pointer' }}
                    key={req.id}
                  >
                    <ListIcon as={MdPendingActions} color="yellow.500" />
                    Solicitado el {format(req.createdAt, 'dd/MM/yy')} por monto{' '}
                    {decimalFormat(req.amountRequested, req.currency)}
                  </ListItem>
                ))}
              </List>
            </Link>
          </CardBody>
        </Card>
      </Flex>
    </div>
  );
};

export default HomePage;
