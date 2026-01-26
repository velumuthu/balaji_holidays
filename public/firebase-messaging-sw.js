
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
// "Default" Firebase app is used for background notifications
const firebaseConfig = {
  apiKey: 'AIzaSyDkclL28zyCUWBoCkeyWjevAUwaH_13288',
  authDomain: 'studio-9989645986-f96da.firebaseapp.com',
  projectId: 'studio-9989645986-f96da',
  storageBucket: 'studio-9989645986-f96da.appspot.com',
  messagingSenderId: '182629101457',
  appId: '1:182629101457:web:c9dfc9c51f31502b2e3430',
};
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
