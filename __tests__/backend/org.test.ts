import type { Organization } from '@prisma/client';
import { prismaMock } from '../TestUtils/MockPrisma';
// import prisma from '../../server/db/client';

async function createOrg(org: Organization) {
  return await prismaMock.organization.create({
    data: org,
  });
}

test('Unit tests org create', async () => {
  // const org = {
  //   id: '',
  //   createdAt: new Date(),
  //   updatedAt: null,
  //   createdById: '',
  //   updatedById: null,
  //   displayName: '',
  //   accountId: '',
  //   allowedUsers: [],
  //   archived: false,
  //   softDeleted: false,
  // };
  // prismaMock.organization.create.mockResolvedValue(org);
  // await expect(createOrg(org)).resolves.toEqual(org);
});
