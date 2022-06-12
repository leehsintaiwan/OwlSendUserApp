import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import HomeScreen from "./app/screens/HomeScreen";
import { store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <HomeScreen />
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
