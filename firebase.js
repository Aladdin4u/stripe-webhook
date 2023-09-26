import { config } from "dotenv";
config();
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MSGSENDERID,
  appId: process.env.APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function writeUserData(receipt) {
  const postListRef = ref(db, "receipt");
  const newPostRef = push(postListRef);
  set(newPostRef, receipt);
}
function getData() {
  const dbRef = ref(db, "receipt");
  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey, ":", childData);
      });
    },
    {
      onlyOnce: true,
    }
  );
}

export default writeUserData;
