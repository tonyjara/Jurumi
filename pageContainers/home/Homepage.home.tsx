import { myToast } from '@/components/Toasts & Alerts/MyToast';
import { Button } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

const HomePage = () => {
  const [isTokenFound, setTokenFound] = useState(false);
  return (
    <div>
      Homepage
      {/* <Button onClick={() => getNotificationsToken(setTokenFound)}>
        Set notifications
      </Button> */}
      <Button onClick={() => myToast.success('hey')}>Notifications</Button>
      {isTokenFound && 'Notification permission enabled 👍🏻 '}
      {!isTokenFound && 'Need notification permission ❗️ '}
    </div>
  );
};

export default HomePage;
