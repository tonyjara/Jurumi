import type { IconType } from 'react-icons';
import type { LinkItemChild } from '../components/NavItemChild';
import { FiHome, FiSettings, FiUsers, FiGlobe } from 'react-icons/fi';
import { BsCash, BsCashStack } from 'react-icons/bs';
import { TbReceiptTax, TbSeeding } from 'react-icons/tb';
import { CgOrganisation } from 'react-icons/cg';
import { MdApproval } from 'react-icons/md';
import { AiFillBank, AiOutlineProject } from 'react-icons/ai';
import { FaExchangeAlt, FaDonate } from 'react-icons/fa';
import { TbReportMoney } from 'react-icons/tb';
import { IoIosPeople } from 'react-icons/io';
import { VscOrganization } from 'react-icons/vsc';
import { TfiGallery } from 'react-icons/tfi';
export interface LinkItemProps {
  name: string;
  icon: IconType;
  dest: string; //destination
  children?: LinkItemChild[];
}

const AdminLinks: (isAdmin: boolean) => Array<LinkItemProps> = (isAdmin) => {
  return isAdmin
    ? [
        {
          name: 'Seed',
          icon: TbSeeding,
          dest: '/admin/seed',
        },
      ]
    : [];
};
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
          name: 'Socios',
          icon: IoIosPeople,
          dest: '/mod/members',
        },
        {
          name: 'Organización',
          icon: CgOrganisation,
          dest: '/mod/organization',
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
        {
          name: 'Rendiciones',
          icon: TbReportMoney,
          dest: '/mod/expense-reports',
        },
        { name: 'Contribuyentes', icon: TbReceiptTax, dest: '/mod/taxpayers' },
        { name: 'Aprobaciones', icon: MdApproval, dest: '/mod/approvals' },
        { name: 'Vistas', icon: FiGlobe, dest: '/mod/views' },
        { name: 'Galería', icon: TfiGallery, dest: '/mod/gallery' },
      ]
    : [];
};

export const SidebarLinks: (
  isAdminOrMod: boolean,
  isAdmin: boolean
) => Array<LinkItemProps> = (isAdminModOrObserver, isAdmin) => {
  return [
    { name: 'Inicio', icon: FiHome, dest: '/home' },
    ...AdminLinks(isAdmin),
    ...AdminModLinks(isAdminModOrObserver),
    { name: 'Mi asociación', icon: VscOrganization, dest: '/home/membership' },
    { name: 'Mis solicitudes', icon: BsCash, dest: '/home/requests' },
    {
      name: 'Mis rendiciones',
      icon: TbReportMoney,
      dest: '/home/expense-reports',
    },
    { name: 'Configuración', icon: FiSettings, dest: '/home/settings' },
  ];
};
