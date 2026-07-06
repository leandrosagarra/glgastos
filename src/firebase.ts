import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Public client-side keys from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyBd32S9OVNd9gaJWjlyc5x3O8TGUtQ3yVE",
  authDomain: "capable-analogy-qnzsc.firebaseapp.com",
  projectId: "capable-analogy-qnzsc",
  storageBucket: "capable-analogy-qnzsc.firebasestorage.app",
  messagingSenderId: "25147878177",
  appId: "1:25147878177:web:dedc9f176c7267a7406c60"
};

const app = initializeApp(firebaseConfig);

// The custom database ID created for this applet
export const db = getFirestore(app, "ai-studio-gestordegastosin-c0096038-929d-4d79-9543-a64d0f0f1710");
export default db;
