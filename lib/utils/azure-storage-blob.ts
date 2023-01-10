import type { ContainerClient } from '@azure/storage-blob';
import { BlobServiceClient } from '@azure/storage-blob';

const createBlobInContainer = async (
  containerClient: ContainerClient,
  file: File
) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
};

const uploadFileToBlob = async (
  file: File | null,
  containerName: string,
  connectionString: string
): Promise<string | null> => {
  if (!file) return null;

  const blobService = new BlobServiceClient(connectionString);

  // get Container - full public read access
  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });

  // upload file
  await createBlobInContainer(containerClient, file);

  const client = containerClient.getBlobClient(file.name);

  return client.url;
};

export default uploadFileToBlob;
