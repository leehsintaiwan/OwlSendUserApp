import { StyleSheet, Text, View } from "react-native";
import React from "react";

import OrderStatus from "../components/OrderStatus";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <OrderStatus />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
