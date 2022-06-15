import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import Colors from "../core/Colors";

const FindingDrivers = ({ orderStatus }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Image source={require("../assets/waiting.png")} style={styles.icon} />
      </View>
      <View style={styles.textContainer}>
        <Text h2 style={[styles.text]}>
          Looking for Drivers
        </Text>
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
    flex: 1,
  },

  gif: {
    width: "100%",
    height: "38%",
  },

  icon: {
    width: 50,
    height: 50,
    position: "absolute",
    right: 15,
  },

  textContainer: {
    backgroundColor: Colors.primary,
    height: "38%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },

  text: {
    color: "white",
    fontWeight: "700",
  },

  statusContainer: {
    height: "18%",
    justifyContent: "center",
  },
});
