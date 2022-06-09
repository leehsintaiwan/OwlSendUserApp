import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { db } from "./app/core/Config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import PickupScreen from "./app/screens/PickupScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <PickupScreen />
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
