import { protectedProcedure, router } from '../initTrpc';

import { z } from 'zod';
// import type { ContainerClient } from '@azure/storage-blob';
// import { BlobServiceClient } from '@azure/storage-blob';
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
//! DO NOTUSE THIS, lambdas are not meant to handle image uploads. This is kept as an example of bad implementation.
const validateFileUpload = z.object({
  file: z
    .any()
    .refine((files) => files?.length == 1, 'Favor adjunte una imagen.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `La imágen debe tener menos de 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp solo estos formatos son aceptados.'
    ),
});

// const connString = process.env.AZURE_STORAGE_CONNECTION_STRING;
// const checkConnString = () => {
//   if (!connString) {
//     throw Error('Azure Storage Connection string not found');
//   }
// };

// const createBlobInContainer = async (
//   containerClient: ContainerClient,
//   file: File
// ) => {
//   // create blobClient for container
//   const blobClient = containerClient.getBlockBlobClient(file.name);

//   // set mimetype as determined from browser with file upload control
//   const options = { blobHTTPHeaders: { blobContentType: file.type } };

//   // upload file
//   await blobClient.uploadData(file, options);
// };

export const storageRouter = router({
  uploadSingleImage: protectedProcedure
    .input(validateFileUpload)
    .mutation(async () => {
      // console.log(input);
      // // Creates container with users id and uploads the file with the client provided image name. Then returns the url.
      // if (!input.file) return;
      // checkConnString();
      // const userId = ctx.session.user.id;
      // const blobServiceClient = BlobServiceClient.fromConnectionString(
      //   connString!
      // );
      // const containerClient = blobServiceClient.getContainerClient(userId);
      // await containerClient.createIfNotExists({
      //   access: 'container',
      // });
      // //upload file
      // await createBlobInContainer(containerClient, input.file);
      // const client = containerClient.getBlobClient(input.file.name);
      // return client.url;
    }),
});
