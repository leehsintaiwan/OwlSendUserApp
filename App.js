import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { db } from "./app/core/Config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import PickupScreen from "./app/screens/PickupScreen";

export default function App() {
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
    <View style={styles.container}>
      <PickupScreen />
      {/* <Button title="Create New doc" onPress={Create}></Button>
      <Button title="Read Doc" onPress={Read}></Button>
      {userDoc != null && <Text>Bio: {userDoc.bio}</Text>} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
