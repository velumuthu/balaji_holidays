
'use client';

import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';

let messaging: Messaging | null = null;
if (typeof window !== 'undefined') {
    const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
}

export const requestPermission = () => {
  if (!messaging) {
    return Promise.resolve('denied' as NotificationPermission);
  }
  console.log('Requesting permission...');
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
    return permission;
  });
};

export const getMessagingToken = async () => {
  let currentToken = '';
  if (!messaging) return;
  try {
    currentToken = await getToken(messaging, {
      vapidKey: 'BPAuQz0gN_pC-eL0jJ_n-iQ2A2fH4XzYjW1zZ7vX9zO5-9cQ3E5jR9yH_rN-cT2gI1wP8sL6lK3yY4',
    });
    console.log('FCM token:', currentToken);
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
