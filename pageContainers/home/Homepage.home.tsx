// import { trpcClient } from '@/lib/utils/trpcClient';
// import { Button } from '@chakra-ui/react';

const HomePage = () => {
  // const { refetch } = trpcClient.notifications.notifyAll.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   enabled: false,
  // });

  return (
    <div>
      Homepage
      {/* <Button onClick={() => refetch()}>Notifications</Button> */}
    </div>
  );
};

export default HomePage;
