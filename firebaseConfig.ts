// src/services/firebaseConfig.ts
import { initializeApp, getApps } from '@react-native-firebase/app';
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
} from "@env";


const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  appId: FIREBASE_APP_ID,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
};


if (!getApps().length) {
  initializeApp(firebaseConfig);
}
