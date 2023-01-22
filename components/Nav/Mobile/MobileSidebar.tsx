import { Drawer, DrawerContent } from '@chakra-ui/react';
import { AccordionIcon } from '@chakra-ui/react';
import { AccordionPanel } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionItem } from '@chakra-ui/react';
import { useColorModeValue, Flex, CloseButton, Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import NavItem from '../components/NavItem';
import NavItemChild from '../components/NavItemChild';
import OrganizationSelect from '../components/OrganizationSelect';
import { SidebarLinks } from '../Data/SidebarLinks';
interface SidebarProps {
  onClose: () => void;
  isOpen: boolean;
}

const MobileSidebar = ({ onClose, isOpen }: SidebarProps) => {
  const { data } = useSession();
  const isAdminOrMod =
    data?.user.role === 'ADMIN' || data?.user.role === 'MODERATOR';

  return (
    <Drawer
      autoFocus={false}
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      returnFocusOnClose={false}
      onOverlayClick={onClose}
      size="full"
    >
      <DrawerContent>
        <Box
          zIndex={2}
          transition="0.2s ease"
          bg={useColorModeValue('white', 'gray.900')}
          borderRight="1px"
          borderRightColor={useColorModeValue('gray.200', 'gray.700')}
          w={'full'}
          pos="fixed"
          h="full"
          overflowY={'auto'}
          display={{ base: 'block', md: 'none' }}
        >
          <Flex h="20" alignItems="center" mx="24px" justifyContent="center">
            {/* TEXT SHOWN ONLY ON DESKTOP */}

            <OrganizationSelect />
            <CloseButton onClick={onClose} />
          </Flex>

          {SidebarLinks(isAdminOrMod).map((link) => (
            <div key={link.name}>
              {link.children?.length && (
                <Accordion allowToggle>
                  <AccordionItem as={'div'}>
                    {/* the column fixes annoying margin leftrover when minimized */}
                    <Flex>
                      <NavItem
                        onClick={onClose}
                        icon={link.icon}
                        dest={link.dest}
                      >
                        {link.name}
                      </NavItem>
                      <AccordionButton justifyContent={'left'}>
                        {<AccordionIcon />}
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
                <NavItem onClick={onClose} icon={link.icon} dest={link.dest}>
                  {link.name}
                </NavItem>
              )}
            </div>
          ))}
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSidebar;
