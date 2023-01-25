import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import type { IconType } from 'react-icons';
interface NavItemProps {
  icon: IconType;
  dest: string; //destination
  minimized?: boolean;
  onClose?: () => void;
  name: string;
}
const DesktopNavItem = ({
  icon,
  onClose,
  dest,
  minimized,
  name,
}: NavItemProps) => {
  const router = useRouter();
  const isCurrentLocation = router.asPath === dest;
  return (
    <Link
      onClick={() => onClose && onClose()}
      href={dest}
      style={{ textDecoration: 'none' }}
    >
      <Tooltip
        hasArrow
        openDelay={0}
        placement="auto"
        isDisabled={!minimized}
        label={name}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'cyan.400',
            color: 'white',
          }}
          justifyContent={minimized ? 'center' : 'left'}
        >
          {icon && (
            <Icon
              color={isCurrentLocation ? 'teal.300' : undefined}
              mr={minimized ? '0' : '4'}
              _groupHover={{
                color: 'white',
              }}
              as={icon}
              fontSize="20px"
            />
          )}
          <Text fontSize="12px">{!minimized && name}</Text>
        </Flex>
      </Tooltip>
    </Link>
  );
};

export default DesktopNavItem;
