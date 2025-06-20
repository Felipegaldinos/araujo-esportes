
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDf2t1p8NrX1BnOjdXBJljRWv-Szg5_h6E",
  authDomain: "catalogo-araujo-esportes.firebaseapp.com",
  projectId: "catalogo-araujo-esportes",
  storageBucket: "catalogo-araujo-esportes.firebasestorage.app",
  messagingSenderId: "1000944452430",
  appId: "1:1000944452430:web:4c6419e2f81fa36e6a541f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

auth.useDeviceLanguage();

export default app;
