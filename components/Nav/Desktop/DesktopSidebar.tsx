import { IconButton } from '@chakra-ui/react';
import { AccordionIcon } from '@chakra-ui/react';
import { AccordionPanel } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionItem } from '@chakra-ui/react';
import { useColorModeValue, Flex, Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { TbChevronsLeft, TbLayoutSidebarRightCollapse } from 'react-icons/tb';
import DesktopNavItem from '../components/DesktopNavItem';
import NavItemChild from '../components/NavItemChild';
import OrganizationSelect from '../components/OrganizationSelect';
import { SidebarLinks } from '../Data/SidebarLinks';
interface SidebarProps {
  minimized: boolean;
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopSidebar = ({ minimized, setMinimized }: SidebarProps) => {
  const { data } = useSession();
  const isAdminOrMod =
    data?.user.role === 'ADMIN' || data?.user.role === 'MODERATOR';
  const isAdmin = data?.user.role === 'ADMIN';
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

      {SidebarLinks(isAdminOrMod, isAdmin).map((link) => (
        <div key={link.name}>
          {link.children?.length && (
            <Accordion allowToggle>
              <AccordionItem as={'div'}>
                {/* the column fixes annoying margin leftrover when minimized */}
                <Flex flexDir={minimized ? 'column' : 'row'}>
                  <DesktopNavItem
                    minimized={minimized}
                    icon={link.icon}
                    dest={link.dest}
                    name={link.name}
                  />

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
            <DesktopNavItem
              name={link.name}
              minimized={minimized}
              icon={link.icon}
              dest={link.dest}
            />
          )}
        </div>
      ))}
    </Box>
  );
};

export default DesktopSidebar;
