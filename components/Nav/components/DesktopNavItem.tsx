import { Flex, Icon, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
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
              mr={minimized ? '0' : '4'}
              fontSize="20px"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {!minimized && name}
        </Flex>
      </Tooltip>
    </Link>
  );
};

export default DesktopNavItem;
