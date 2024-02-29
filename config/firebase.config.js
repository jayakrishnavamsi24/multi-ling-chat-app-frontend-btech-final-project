import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDHFMZZsKJSvTydw273f00Dy7qHQ-ehGmc", // Replace with your actual firebaseConfig
  authDomain: "chat-app-final-project-4b504.firebaseapp.com",
  projectId: "chat-app-final-project-4b504",
  storageBucket: "chat-app-final-project-4b504.appspot.com",
  messagingSenderId: "1060495329286",
  appId: "1:1060495329286:web:265554120a837d5e9b9b87"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestoreDB = getFirestore(app);

export { app, firebaseAuth, firestoreDB };
