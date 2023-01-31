importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');

importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyB2FdCJOSZteebC1hTssx5p0CSorpma_oQ',
  authDomain: 'jurumi-sys.firebaseapp.com',
  projectId: 'jurumi-sys',
  storageBucket: 'jurumi-sys.appspot.com',
  messagingSenderId: '925947066980',
  appId: '1:925947066980:web:6c4429d62511fdc88efd71',
  measurementId: 'G-FMNCT4DDQP',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
