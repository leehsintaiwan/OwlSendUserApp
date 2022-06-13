import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import Colors from "../core/Colors";

const FindingDrivers = () => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text h2 style={[styles.text]}>
          Looking for Drivers
        </Text>
        <Image
          source={require("../assets/waiting.png")}
          style={styles.waiting}
        />
      </View>
      <Image
        source={require("../assets/finding-drivers.gif")}
        style={styles.gif}
      />
    </View>
  );
};

export default FindingDrivers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    height: "40%",
    width: "100%",
  },

  gif: {
    width: "100%",
    height: "45%",
  },

  labelContainer: {
    backgroundColor: Colors.primary,
    height: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },

  text: {
    color: "white",
    fontWeight: "700",
  },

  waiting: {
    width: 50,
    height: 50,
    position: "absolute",
    right: 15,
  },
});
