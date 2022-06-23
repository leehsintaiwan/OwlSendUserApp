import { useEffect } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import Colors from "../core/Colors";
import { cleanupAllDrivers, waitForDrivers } from "../core/SearchingAlgorithm";

// Time out time for requesting drivers
const TIME_OUT_SECONDS = 300;
let timer = null;

const FindingDrivers = ({
  navigation,
  userProfile,
  orig,
  dest,
  showSettings,
  setShowSettings,
}) => {
  useEffect(() => {
    setShowSettings(false);

    // So this doesn't execute twice after setShowSettings refreshes the screen
    if (showSettings) {
      timer = setTimeout(() => {
        cleanupAllDrivers(userProfile);
        navigation.navigate("Form");
        Alert.alert("Sorry, unable to find drivers to fulfill your order.");
      }, TIME_OUT_SECONDS * 1000);

      waitForDrivers(userProfile, orig, dest, timer, navigation);
    }
  }, []);

  const handleCancel = () => {
    clearTimeout(timer);
    cleanupAllDrivers(userProfile);
    navigation.navigate("Form");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text h2 style={[styles.text]}>
          Looking for Drivers
        </Text>
      </View>
      <Image
        source={require("../assets/finding-drivers.gif")}
        style={styles.gif}
      />
      <Button
        title="Cancel"
        raised={true}
        buttonStyle={styles.buttonStyle}
        containerStyle={styles.buttonContainerStyle}
        titleStyle={styles.buttonTitleStyle}
        onPress={handleCancel}
      />
    </View>
  );
};

export default FindingDrivers;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.dark,
    borderRadius: 6,
  },

  buttonContainerStyle: {
    marginTop: 8,
    width: 200,
    borderRadius: 6,
    alignSelf: "center",
  },

  buttonTitleStyle: {
    fontWeight: "500",
  },

  container: {
    backgroundColor: "white",
    flex: 1,
  },

  gif: {
    width: "100%",
    height: "40%",
  },

  textContainer: {
    backgroundColor: Colors.primary,
    height: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: "white",
    fontWeight: "700",
  },
});
