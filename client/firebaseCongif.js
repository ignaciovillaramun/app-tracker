import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAqmIVk0s4ce5LAEBz7STkqdzgSCP3G9iQ',
  authDomain: 'shuttle-tracker-3997d.firebaseapp.com',
  projectId: 'shuttle-tracker-3997d',
  storageBucket: 'shuttle-tracker-3997d.appspot.com',
  messagingSenderId: '1005418899561',
  appId: '1:1005418899561:web:6269b4774ba12176aa5af8',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
