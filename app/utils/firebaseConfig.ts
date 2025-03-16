import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig1 = {
  apiKey: "AIzaSyAWdukwbCE6VQVCy318jNNF4PvZbLIE8XA",
  authDomain: "e-livraria-64013.firebaseapp.com",
  projectId: "e-livraria-64013",
  storageBucket: "e-livraria-64013.appspot.com",
  messagingSenderId: "534592389302",
  appId: "1:534592389302:web:724cac24a8d52fcf1fa617",
  measurementId: "G-419YSSCDH8"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyA0Ac2oT8WCwaZ2lilwHdsiYKOqyojo768",
//   authDomain: "sjc-biblioteca.firebaseapp.com",
//   projectId: "sjc-biblioteca",
//   storageBucket: "sjc-biblioteca.firebasestorage.app",
//   messagingSenderId: "978623261773",
//   appId: "1:978623261773:web:856f1899c6fe5698bd8004",
//   measurementId: "G-R8568G40JC"
// };

const app = initializeApp(firebaseConfig1);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };




