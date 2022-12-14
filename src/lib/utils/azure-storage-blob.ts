import type { ContainerClient } from '@azure/storage-blob';
import { BlobServiceClient } from '@azure/storage-blob';

// const containerName = `tutorial-container`; //name of folder
const sasToken = process.env.NEXT_PUBLIC_STORAGE_SASTOKEN;
const storageAccountName = process.env.NEXT_PUBLIC_STORAGE_RESOURCE_NAME;

// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};

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
  containerName: string
): Promise<string | null> => {
  if (!isStorageConfigured) {
    throw 'storage not configured';
  }
  if (!file) return null;

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

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
