
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtRQ-OjxOADYWZYPq_1k9j9gUNc_BAj1E",
  authDomain: "news-app-lovable.firebaseapp.com",
  projectId: "news-app-lovable",
  storageBucket: "news-app-lovable.appspot.com",
  messagingSenderId: "541242108051",
  appId: "1:541242108051:web:c7d7b2cd3d1a1b4e4f4f4f",
  measurementId: "G-GGMW9MFZF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
