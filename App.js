import { Button, StyleSheet, Text, View } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./app/core/Config";
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

import HomeScreen from "./app/screens/HomeScreen";

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <HomeScreen />
      </View>
    </Provider>
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
