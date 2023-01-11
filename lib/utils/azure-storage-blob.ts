import type { ContainerClient } from '@azure/storage-blob';
import { BlobServiceClient } from '@azure/storage-blob';

// AllowedOrigins: ['*'],
// AllowedMethods: ['GET'],
// AllowedHeaders: [],
// ExposedHeaders: [],
// MaxAgeInSeconds: 60

const uploadFileToBlob = async (
  file: File | null,
  containerName: string,
  connectionString: string
): Promise<string | null> => {
  if (!file) return null;

  const blobService = new BlobServiceClient(connectionString);
  blobService.setProperties({
    cors: [
      {
        allowedOrigins: '*',
        allowedMethods: 'PUT',
        allowedHeaders: '*',
        exposedHeaders: '*',
        maxAgeInSeconds: 60,
      },
    ],
  });

  // get Container - full public read access
  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);

  await containerClient.createIfNotExists({
    access: 'container',
  });

  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);

  const client = containerClient.getBlobClient(file.name);

  return client.url;
};

export default uploadFileToBlob;
