import type { ContainerClient } from '@azure/storage-blob';
import { BlockBlobClient } from '@azure/storage-blob';
import { BlobServiceClient } from '@azure/storage-blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';
import multipart from 'parse-multipart';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
const connString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const checkConnString = () => {
  if (!connString) {
    throw Error('Azure Storage Connection string not found');
  }
};

const createBlobInContainer = async (
  containerClient: ContainerClient,
  file: multipart.ParsedFile
) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.filename);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file.data, options);
};

export default async function uploadtToStorageBlob(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    checkConnString();
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({
        data: null,
        error: 'Method Not Allowed',
      });
      return;
    }
    const session = await getServerAuthSession({ req, res });
    const user = session?.user;

    if (!user) {
      return res.status(401).send({ error: 'unauthorized' });
    }

    const bodyBuffer = Buffer.from(req.body);

    const boundary = multipart.getBoundary(req.headers['content-type']!);

    const parts = multipart.Parse(bodyBuffer, boundary);

    if (!parts[0]) return res.send('no parts');

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      connString!
    );
    const container = user.id;
    const containerClient = blobServiceClient.getContainerClient(container);
    await containerClient.createIfNotExists({
      access: 'container',
    });

    await createBlobInContainer(containerClient, parts[0]);

    const client = containerClient.getBlobClient(parts[0].filename);

    return res.json({ url: client.url });

    res.send({ error: 'not processed' });
  } catch (err) {
    return res.status(500).json({ err });
  }
}
