import { useSession } from 'next-auth/react';
import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@chakra-ui/react';

const Home = () => {
  const { data } = useSession();
  console.log(data);

  return (
    <div>
      <h1>WELCOME HOME</h1>
      <Button onClick={()=> signOut()}>Signout</Button>
    </div>
  );
};

export default Home;
