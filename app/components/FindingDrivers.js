import { StyleSheet, Text, View } from "react-native";
import React from "react";

const FindingDrivers = () => {
  return (
    <View style={styles.container}>
      <Text>FindingDrivers</Text>
    </View>
  );
};

export default FindingDrivers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    height: "45%",
    width: "100%",
  },
});
