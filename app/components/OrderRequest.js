import { StyleSheet, Text, View } from "react-native";
import React from "react";

const OrderRequest = () => {
  return (
    <View style={styles.container}>
      <Text>OrderRequest</Text>
    </View>
  );
};

export default OrderRequest;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: "45%",
    width: "100%",
  },
});
