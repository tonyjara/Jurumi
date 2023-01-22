import type { IconType } from 'react-icons';
import type { LinkItemChild } from '../components/NavItemChild';
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
export interface LinkItemProps {
  name: string;
  icon: IconType;
  dest: string; //destination
  children?: LinkItemChild[];
}

const AdminModLinks: (isAdminOrMod: boolean) => Array<LinkItemProps> = (
  isAdminOrMod
) => {
  return isAdminOrMod
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
};

export const SidebarLinks: (isAdminOrMod: boolean) => Array<LinkItemProps> = (
  isAdminOrMod
) => {
  return [
    { name: 'Inicio', icon: FiHome, dest: '/home' },

    ...AdminModLinks(isAdminOrMod),
    { name: 'Mis solicitudes', icon: BsCash, dest: '/home/requests' },
    {
      name: 'Mis rendiciones',
      icon: TbReportMoney,
      dest: '/home/expense-reports',
    },
    { name: 'Configuración', icon: FiSettings, dest: '/home/settings' },
  ];
};
