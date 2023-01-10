import {
  //   Aborter,
  //   BlobURL,
  //   BlockBlobURL,
  //   ContainerURL,
  //   ServiceURL,
  //   StorageURL,
  //   SharedKeyCredential,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  //   uploadStreamToBlockBlob,
  //   BlobSASPermissions,
  SASProtocol,
  //   AnonymousCredential,
  ContainerSASPermissions,
  AccountSASServices,
  AccountSASResourceTypes,
  AccountSASPermissions,
  generateAccountSASQueryParameters,
} from '@azure/storage-blob';

const accountName = process.env.STORAGE_RESOURCE_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY!;
if (!accountName) throw Error('Azure Storage accountName not found');
if (!accountKey) throw Error('Azure Storage accountKey not found');

const credentials = new StorageSharedKeyCredential(accountName, accountKey);
// const ONE_MINUTE = 60 * 1000;
/*
const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
By default, credential is always the last element of pipeline factories
const factories = serviceURL.pipeline.factories;
const sharedKeyCredential = factories[factories.length - 1];
*/

// AS.getServiceUrl = () => {
//   const credentials = new StorageSharedKeyCredential(
//     STORAGE_ACCOUNT_NAME,
//     ACCOUNT_ACCESS_KEY
//   );
//   const pipeline = StorageURL.newPipeline(credentials);
//   const serviceURL = new ServiceURL(
//     `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
//     pipeline
//   );
//   return serviceURL;
// };

const createConnectionString = () => {
  const sasOptions = {
    services: AccountSASServices.parse('btqf').toString(), // blobs, tables, queues, files
    resourceTypes: AccountSASResourceTypes.parse('sco').toString(), // service, container, object
    permissions: AccountSASPermissions.parse('rwdlacupi'), // permissions
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 10 * 60 * 1000), // 10 minutes
  };

  const sasToken = generateAccountSASQueryParameters(
    sasOptions,
    credentials
  ).toString();

  return `https://${accountName}.blob.core.windows.net/?${sasToken}`;
};

const createBlockBlobSASToken = (containerName: string) => {
  const blobSasToken = generateBlobSASQueryParameters(
    {
      containerName, // Required
      permissions: ContainerSASPermissions.parse('racwdl'), // Required
      startsOn: new Date(), // Optional
      expiresOn: new Date(new Date().valueOf() + 300), // Required. Date type
      ipRange: { start: '0.0.0.0', end: '255.255.255.255' }, // Optional
      protocol: SASProtocol.HttpsAndHttp, // Optional
      // version: '2016-05-31', // Optional
    },
    credentials
  ).toString();

  return blobSasToken;
};

const createContainerSASToken = (containerName: string) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 5); // Skip clock skew with server
  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);

  const containerSAS = generateBlobSASQueryParameters(
    {
      containerName,
      expiresOn: tmr,
      startsOn: now,
      permissions: ContainerSASPermissions.parse('racwdl'),
      protocol:
        process.env.NODE_ENV === 'development'
          ? SASProtocol.HttpsAndHttp
          : SASProtocol.Https,
      // version: '2016-05-31',
    },
    credentials
  );
  // const sasURL = `${containerURL.url}?${containerSAS}`;
  return containerSAS;
};

// AS.createBlockBlobSASURL = (blobName, containerName) => {
//   const blockBlobURL = getBlockBlobUrl(blobName, containerName);
//   const blobSAS = createBlockBlobSASToken(blobName, containerName);
//   const sasURL = `${blockBlobURL.url}?${blobSAS}`;
//   return sasURL;
// };

// AS.createContainer = (containerName) => {
//   const serviceURL = getServiceUrl();
//   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
//   return containerURL.create(Aborter.none);
// };

// AS.getBlockBlobUrl = (blobName, containerName) => {
//   const serviceURL = getServiceUrl();
//   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
//   const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
//   return blockBlobURL;
// };

// AS.uploadToBlockBlobFromStream = (
//   blobName,
//   containerName,
//   readableStream,
//   fileSizeInBytes
// ) => {
//   const blockBlobURL = getBlockBlobUrl(blobName, containerName);
//   return uploadStreamToBlockBlob(
//     Aborter.none,
//     readableStream,
//     blockBlobURL,
//     256 * 1024,
//     2,
//     {
//       progress: function (ev) {
//         console.log((ev.loadedBytes / fileSizeInBytes) * 100);
//       },
//     }
//   );
// };

// // const uploadFileFromBuffer = (blobName, containerName,buffer, fileSizeInBytes) =>{

// // }

// AS.uploadBlockBlobWithSAS = (
//   blobName,
//   containerName,
//   readableStream,
//   fileSizeInBytes
// ) => {
//   const blockBlobSasUrl = createBlockBlobSASURL(blobName, containerName);
//   const blockBlobURL = new BlockBlobURL(
//     blockBlobSasUrl,
//     StorageURL.newPipeline(new AnonymousCredential())
//   );
//   return uploadStreamToBlockBlob(
//     Aborter.none,
//     readableStream,
//     blockBlobURL,
//     4 * 1024 * 1024,
//     2,
//     {
//       progress: function (ev) {
//         console.log((ev.loadedBytes / fileSizeInBytes) * 100);
//       },
//     }
//   );
// };

// AS.deleteBlockBlob = (blobName, containerName) => {
//   const blockBlobURL = getBlockBlobUrl(blobName, containerName);
//   return blockBlobURL.delete(Aborter.none);
// };

// AS.downloadBlob = async (blobName, containerName) => {
//   const blockBlobURL = await getBlockBlobUrl(blobName, containerName);
//   const downloadStream = await blockBlobURL.download(aborter, 0);
//   return downloadStream;
// };

export const AS = {
  createBlockBlobSASToken,
  createConnectionString,
  createContainerSASToken,
};
