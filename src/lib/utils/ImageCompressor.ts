import imageCompression from 'browser-image-compression';

export const compressAvatar = async (file: File) => {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 480,
    useWebWorker: true,
  };

  const compressedImage = await imageCompression(file, options);

  return compressedImage;
};
export const compressCoverPhoto = async (file: File) => {
  const options = {
    maxSizeMB: 0.2,
    // maxWidthOrHeight: 480,
    useWebWorker: true,
  };

  const compressedImage = await imageCompression(file, options);

  return compressedImage;
};
