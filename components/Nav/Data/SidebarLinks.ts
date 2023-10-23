import type { IconType } from "react-icons";
import { FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { BsCash, BsCashStack, BsLink45Deg } from "react-icons/bs";
import { TbReceiptTax, TbSeeding } from "react-icons/tb";
import { CgOrganisation } from "react-icons/cg";
import { MdApproval, MdOutlineAssignmentReturn } from "react-icons/md";
import { AiFillBank, AiOutlineProject } from "react-icons/ai";
import { FaExchangeAlt, FaDonate } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { IoIosPeople } from "react-icons/io";
import { VscOrganization } from "react-icons/vsc";
import { TfiGallery } from "react-icons/tfi";
import { ImPageBreak } from "react-icons/im";
export interface LinkItemProps {
  name: string;
  icon: IconType;
  dest: string; //destination
  children?: {
    name: string;
    icon: IconType;
    dest: string; //destination
  }[];
}

const AdminLinks: (isAdmin: boolean) => Array<LinkItemProps> = (isAdmin) => {
  return isAdmin
    ? [
        {
          name: "Seed",
          icon: TbSeeding,
          dest: "/admin/seed",
        },
      ]
    : [];
};
const AdminModLinks: (isAdminOrMod: boolean) => Array<LinkItemProps> = (
  isAdminOrMod,
) => {
  return isAdminOrMod
    ? [
        {
          name: "Organización",
          icon: CgOrganisation,
          dest: "/mod/organization",
          children: [
            {
              name: "Proyectos",
              icon: AiOutlineProject,
              dest: "/mod/projects",
            },
            {
              name: "Desembolsos",
              icon: FaDonate,
              dest: "/mod/imbursements",
            },
            {
              name: "Socios",
              icon: IoIosPeople,
              dest: "/mod/members",
            },
            {
              name: "Contribuyentes",
              icon: TbReceiptTax,
              dest: "/mod/taxpayers",
            },
          ],
        },
        {
          name: "Cuentas",
          icon: AiFillBank,
          dest: "/mod/money-accounts",
          children: [
            {
              name: "Transacciones",
              icon: FaExchangeAlt,
              dest: "/mod/transactions",
            },
            {
              name: "Ajustes de cuenta",
              icon: ImPageBreak,
              dest: "/mod/money-account-offset",
            },
          ],
        },
        {
          name: "Solicitudes",
          icon: BsCashStack,
          dest: "/mod/requests",
          children: [
            {
              name: "Rendiciones",
              icon: TbReportMoney,
              dest: "/mod/expense-reports",
            },
            {
              name: "Devoluciones",
              icon: MdOutlineAssignmentReturn,
              dest: "/mod/expense-returns",
            },

            { name: "Aprobaciones", icon: MdApproval, dest: "/mod/approvals" },
          ],
        },
        {
          name: "Usuarios",
          icon: FiUsers,
          dest: "/mod/users",
          children: [
            {
              icon: BsLink45Deg,
              name: "Links de verificacion",
              dest: "/mod/users/verification-links",
            },
          ],
        },

        { name: "Galería", icon: TfiGallery, dest: "/mod/gallery" },
      ]
    : [];
};

export const SidebarLinks: (
  isAdminOrMod: boolean,
  isAdmin: boolean,
) => Array<LinkItemProps> = (isAdminModOrObserver, isAdmin) => {
  return [
    { name: "Inicio", icon: FiHome, dest: "/home" },
    ...AdminLinks(isAdmin),
    ...AdminModLinks(isAdminModOrObserver),
    { name: "Mi asociación", icon: VscOrganization, dest: "/home/membership" },
    { name: "Mis solicitudes", icon: BsCash, dest: "/home/requests" },
    {
      name: "Mis rendiciones",
      icon: TbReportMoney,
      dest: "/home/expense-reports",
    },
    {
      name: "Mis devoluciones",
      icon: MdOutlineAssignmentReturn,
      dest: "/home/expense-returns",
    },

    { name: "Configuración", icon: FiSettings, dest: "/home/settings" },
  ];
};
