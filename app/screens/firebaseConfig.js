// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCBRDGX2Hv1JSasV2yB54JpebnABA1bO_U",
    authDomain: "ecommerce1-d88c1.firebaseapp.com",
    projectId: "ecommerce1-d88c1",
    storageBucket: "ecommerce1-d88c1.appspot.com",
    messagingSenderId: "553087313843",
    appId: "1:553087313843:web:023c73d3cf89a15854cdc6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
