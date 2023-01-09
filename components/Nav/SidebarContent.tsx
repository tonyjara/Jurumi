import type { BoxProps } from '@chakra-ui/react';
import { AccordionIcon } from '@chakra-ui/react';
import { AccordionPanel } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionItem } from '@chakra-ui/react';
import { useColorModeValue, Flex, CloseButton, Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import type { IconType } from 'react-icons';
import { FiHome, FiSettings, FiUsers, FiGlobe } from 'react-icons/fi';
import { BsCash, BsCashStack } from 'react-icons/bs';
import { TbReceiptTax } from 'react-icons/tb';
import { MdApproval } from 'react-icons/md';
import { AiFillBank } from 'react-icons/ai';
import { FaExchangeAlt, FaDonate } from 'react-icons/fa';
import { TbReportMoney } from 'react-icons/tb';
import type { LinkItemChild } from './NavItemChild';
import NavItemChild from './NavItemChild';
import NavItem from './NavItem';
import OrganizationSelect from './OrganizationSelect';
interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  dest: string; //destination
  children?: LinkItemChild[];
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { data } = useSession();
  // const isAdmin = data?.user.role === 'ADMIN';
  const isAdminOrMod =
    data?.user.role === 'ADMIN' || data?.user.role === 'MODERATOR';

  // const adminLinks: Array<LinkItemProps> = isAdmin
  //   ? [{ name: 'Usuarios', icon: FiUsers, dest: '/mod/users' }]
  //   : [];
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
        { name: 'Aprobaciones', icon: MdApproval, dest: '/mod/approvals' },
        { name: 'Vistas', icon: FiGlobe, dest: '/mod/views' },
      ]
    : [];
  const LinkItems: Array<LinkItemProps> = [
    { name: 'Inicio', icon: FiHome, dest: '/home' },

    // ...adminLinks,
    ...adminOrModLinks,
    //Public links
    { name: 'Contribuyentes', icon: TbReceiptTax, dest: '/home/taxpayers' },
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
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      overflowY={'auto'}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        {/* TEXT SHOWN ONLY ON DESKTOP */}

        <OrganizationSelect />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <div key={link.name}>
          {link.children?.length && (
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <AccordionIcon />
                  <NavItem onClick={onClose} icon={link.icon} dest={link.dest}>
                    {link.name}
                  </NavItem>
                </AccordionButton>
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
  );
};

export default SidebarContent;
