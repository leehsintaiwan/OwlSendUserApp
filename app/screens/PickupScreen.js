import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { db } from "../core/Config";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const PickupScreen = () => {
  const [userDoc, setUserDoc] = useState(null);
  const myDoc = doc(db, "MyCollection", "MyDocument");

  const Create = () => {
    const docData = {
      name: "John",
      bio: "Coder",
    };

    setDoc(myDoc, docData).then(() => {
      alert("Document created");
    });
  };

  const Read = () => {
    getDoc(myDoc).then((snapshot) => {
      if (snapshot.exists) {
        setUserDoc(snapshot.data());
      } else {
        alert("No doc found");
      }
    });
  };

  const Update = () => {
    const newDocData = {
      name: "Vincent",
      bio: "Student",
    };

    updateDoc(myDoc, newDocData);
  };

  const Delete = () => {
    deleteDoc(myDoc);
  };

  return (
    <View>
      <Text>Hello, {userDoc != null && userDoc.bio}</Text>
    </View>
  );
};

export default PickupScreen;

const styles = StyleSheet.create({});
