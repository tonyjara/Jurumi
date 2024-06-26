import { AS } from '@/server/azure/blob-storage';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getSasToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const sasToken = AS.createConnectionString();
  res.status(200).json({ connectionString: sasToken });
}
