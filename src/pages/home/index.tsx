import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button, Divider } from '@chakra-ui/react';
import uploadFileToBlob, {
  isStorageConfigured,
} from '../../lib/utils/azure-storage-blob';

const storageConfigured = isStorageConfigured();

const Home = () => {
  const [blobList, setBlobList] = useState<string[]>([]);

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);

    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} key={inputKey || ''} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
      </button>
    </div>
  );

  // display file name and image
  const DisplayImagesFromContainer = () => (
    <div>
      <h2>Container items</h2>
      <ul>
        {blobList.map((item) => {
          return (
            <li key={item}>
              <div>
                {/* {Path.basename(item)} */}
                <br />
                <img src={item} alt={item} height="200" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <div>
      <h1>WELCOME HOME ON STAGING BRANCH BOI</h1>
      <Button onClick={() => signOut()}>Signout</Button>
      <Divider mt={100} />
      <div>
        <h1>Upload file to Azure Blob Storage</h1>
        {storageConfigured && !uploading && DisplayForm()}
        {storageConfigured && uploading && <div>Uploading</div>}
        <hr />
        {storageConfigured &&
          blobList.length > 0 &&
          DisplayImagesFromContainer()}
        {!storageConfigured && <div>Storage is not configured.</div>}
      </div>
    </div>
  );
};

export default Home;
