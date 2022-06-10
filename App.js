import { Button, StyleSheet, Text, View } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./app/core/Config";
import HomeScreen from "./app/screens/HomeScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <HomeScreen />
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
