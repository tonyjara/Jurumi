import { trpcClient } from '@/lib/utils/trpcClient';
import {
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { FiBell } from 'react-icons/fi';

const NotificationIcon = () => {
  const router = useRouter();
  const context = trpcClient.useContext();
  const backgroundColor = useColorModeValue(
    '#EDF2F7',
    'RGBA(255, 255, 255, 0.1)'
  );
  const { data: notifications } =
    trpcClient.notifications.getMyNotifications.useQuery();
  const { mutate } =
    trpcClient.notifications.markMyNotificationsSeen.useMutation({
      onSuccess: () => {
        context.notifications.invalidate();
      },
    });

  const unseenNotifications = notifications?.some((x) => x && !x.seen);

  const handleMarkSeen = () => {
    mutate();
  };

  return (
    <Menu>
      <MenuButton
        p={'14px'}
        borderRadius="8px"
        transition="all 0.3s"
        _focus={{ boxShadow: 'none' }}
        _hover={{ backgroundColor }}
        onClick={handleMarkSeen}
      >
        {unseenNotifications && (
          <div
            style={{
              position: 'absolute',
              borderRadius: '20px',
              marginTop: '10px',
              marginLeft: '10px',
              width: '10px',
              height: '10px',
              backgroundColor: 'orange',
            }}
          ></div>
        )}
        <FiBell fontSize={'20px'} />
      </MenuButton>

      <Portal>
        <MenuList>
          {notifications?.map((x) => (
            <MenuItem onClick={() => router.push(x.url)} key={x.id}>
              <Flex flexDir={'column'}>
                <Text fontWeight={'bold'}>{x.title}</Text>
                <Text>{x.message}</Text>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default NotificationIcon;
