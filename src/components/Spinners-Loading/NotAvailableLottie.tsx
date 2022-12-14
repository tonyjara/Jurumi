import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../public/not-available.json';

function NotAvailableLottie() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={400} width={600} />;
}

export default NotAvailableLottie;
