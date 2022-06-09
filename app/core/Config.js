import { initializeApp } from "firebase/app";
import { Firestore, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBQu9FrMsBabR-gQP1nbOUmI49YNOU9j2s",
  authDomain: "instantdeliveryapp.firebaseapp.com",
  projectId: "instantdeliveryapp",
  storageBucket: "instantdeliveryapp.appspot.com",
  messagingSenderId: "323064584813",
  appId: "1:323064584813:web:770073a68f2912eed7fd64",
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// How to single read from Firestore:
// const [userDoc, setUserDoc] = useState(null);
//   const myDoc = doc(db, "MyCollection", "MyDocument");

//   const Create = async () => {
//     const docData = {
//       name: "John",
//       bio: "Coder",
//     };

//     await setDoc(myDoc, docData);
//     alert("Document created");
//   };

//   const Read = async () => {
//     const snapshot = await getDoc(myDoc);

//     if (snapshot.exists) {
//       setUserDoc(snapshot.data());
//     } else {
//       alert("No order found for this user");
//     }
//   };

//   const Update = () => {
//     const newDocData = {
//       name: "Vincent",
//       bio: "Student",
//     };

//     updateDoc(myDoc, newDocData);
//   };

//   const Delete = async () => {
//     await deleteDoc(myDoc);
//   };

// useEffect(() => {
//   Create();
//   Read();
//   Update();
//   Delete();
// })
