import type { BoxProps } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { AccordionIcon } from '@chakra-ui/react';
import { AccordionPanel } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionItem } from '@chakra-ui/react';
import { useColorModeValue, Flex, CloseButton, Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import type { IconType } from 'react-icons';
import { FiHome, FiSettings, FiUsers, FiGlobe } from 'react-icons/fi';
import { BsCash, BsCashStack } from 'react-icons/bs';
import {
  TbChevronsLeft,
  TbLayoutSidebarRightCollapse,
  TbReceiptTax,
} from 'react-icons/tb';
import { MdApproval } from 'react-icons/md';
import { AiFillBank, AiOutlineProject } from 'react-icons/ai';
import { FaExchangeAlt, FaDonate } from 'react-icons/fa';
import { TbReportMoney } from 'react-icons/tb';
import type { LinkItemChild } from './components/NavItemChild';
import NavItemChild from './components/NavItemChild';
import NavItem from './components/NavItem';
import OrganizationSelect from './components/OrganizationSelect';
import { useState } from 'react';
interface SidebarProps extends BoxProps {
  onClose: () => void;
  minimized: boolean;
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  dest: string; //destination
  children?: LinkItemChild[];
}

const SidebarContent = ({ onClose, minimized, setMinimized }: SidebarProps) => {
  const { data } = useSession();
  const isAdminOrMod =
    data?.user.role === 'ADMIN' || data?.user.role === 'MODERATOR';

  const adminOrModLinks: Array<LinkItemProps> = isAdminOrMod
    ? [
        {
          name: 'Usuarios',
          icon: FiUsers,
          dest: '/mod/users',
          children: [
            {
              name: 'Links de verificacion',
              dest: '/mod/users/verification-links',
            },
          ],
        },
        {
          name: 'Cuentas',
          icon: AiFillBank,
          dest: '/mod/money-accounts',
        },
        {
          name: 'Proyectos',
          icon: AiOutlineProject,
          dest: '/mod/projects',
        },
        {
          name: 'Desembolsos',
          icon: FaDonate,
          dest: '/mod/imbursements',
        },
        {
          name: 'Transacciones',
          icon: FaExchangeAlt,
          dest: '/mod/transactions',
        },
        { name: 'Solicitudes', icon: BsCashStack, dest: '/mod/requests' },
        { name: 'Contribuyentes', icon: TbReceiptTax, dest: '/mod/taxpayers' },

        { name: 'Aprobaciones', icon: MdApproval, dest: '/mod/approvals' },
        { name: 'Vistas', icon: FiGlobe, dest: '/mod/views' },
      ]
    : [];
  const LinkItems: Array<LinkItemProps> = [
    { name: 'Inicio', icon: FiHome, dest: '/home' },

    ...adminOrModLinks,
    { name: 'Mis solicitudes', icon: BsCash, dest: '/home/requests' },
    {
      name: 'Mis rendiciones',
      icon: TbReportMoney,
      dest: '/home/expense-reports',
    },
    { name: 'Configuración', icon: FiSettings, dest: '/home/settings' },
  ];
  return (
    <Box
      zIndex={2}
      transition="0.2s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: minimized ? 20 : 60 }}
      pos="fixed"
      h="full"
      overflowY={'auto'}
    >
      <Flex h="20" alignItems="center" mx="24px" justifyContent="center">
        {/* TEXT SHOWN ONLY ON DESKTOP */}

        {!minimized && <OrganizationSelect />}
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
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

      {LinkItems.map((link) => (
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

export default SidebarContent;
