import type { Session } from 'next-auth';

export const userSessionMock: Session = {
  user: {
    id: 'cle4o7rl1001cpf2u76p00elh',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'nytojara@gmail.com',
    displayName: 'Nyto',
    role: 'USER',
    isVerified: true,
    profile: null,
  },
  expires: new Date().toISOString(),

  status: 'authenticated',
};

export const adminSessionMock: Session = {
  user: {
    id: 'clddek00c0000pfuegl07osko',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: '340studiospy@gmail.com',
    displayName: 'Tony local',
    role: 'ADMIN',
    isVerified: true,
    profile: null,
  },
  expires: new Date().toISOString(),

  status: 'authenticated',
};
