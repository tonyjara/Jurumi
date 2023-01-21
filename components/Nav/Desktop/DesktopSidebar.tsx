import type { BoxProps } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { AccordionIcon } from '@chakra-ui/react';
import { AccordionPanel } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionItem } from '@chakra-ui/react';
import { useColorModeValue, Flex, CloseButton, Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { TbChevronsLeft, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import NavItem from '../components/NavItem';
import NavItemChild from '../components/NavItemChild';
import OrganizationSelect from '../components/OrganizationSelect';
import { SidebarLinks } from '../SidebarLinks';
interface SidebarProps extends BoxProps {
  onClose: () => void;
  minimized: boolean;
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopSidebar = ({ onClose, minimized, setMinimized }: SidebarProps) => {
  const { data } = useSession();
  const isAdminOrMod =
    data?.user.role === 'ADMIN' || data?.user.role === 'MODERATOR';

  return (
    <Box
      zIndex={2}
      transition="0.2s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ md: minimized ? 20 : 60 }}
      pos="fixed"
      h="full"
      overflowY={'auto'}
      display={{ base: 'none', md: 'block' }}
    >
      <Flex h="20" alignItems="center" mx="24px" justifyContent="center">
        {!minimized && <OrganizationSelect />}
        <IconButton
          aria-label="close drawer"
          display={{ base: 'none', md: 'flex' }}
          onClick={() => setMinimized(!minimized)}
          colorScheme="teal"
          icon={
            minimized ? (
              <TbLayoutSidebarRightCollapse style={{ fontSize: '25px' }} />
            ) : (
              <TbChevronsLeft style={{ fontSize: '25px' }} />
            )
          }
          variant="ghost"
        />
      </Flex>

      {SidebarLinks(isAdminOrMod).map((link) => (
        <div key={link.name}>
          {link.children?.length && (
            <Accordion allowToggle>
              <AccordionItem as={'div'}>
                {/* the column fixes annoying margin leftrover when minimized */}
                <Flex flexDir={minimized ? 'column' : 'row'}>
                  <NavItem
                    minimized={minimized}
                    onClick={onClose}
                    icon={link.icon}
                    dest={link.dest}
                  >
                    {link.name}
                  </NavItem>
                  <AccordionButton
                    display={minimized ? 'none' : 'flex'}
                    justifyContent={minimized ? 'center' : 'left'}
                  >
                    {!minimized && <AccordionIcon />}
                  </AccordionButton>
                </Flex>
                {link.children.map((x) => (
                  <AccordionPanel key={x.name}>
                    <NavItemChild name={x.name} dest={x.dest} />
                  </AccordionPanel>
                ))}
              </AccordionItem>
            </Accordion>
          )}
          {!link.children?.length && (
            <NavItem
              minimized={minimized}
              onClick={onClose}
              icon={link.icon}
              dest={link.dest}
            >
              {link.name}
            </NavItem>
          )}
        </div>
      ))}
    </Box>
  );
};

export default DesktopSidebar;
