import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-elements";
import Colors from "../core/Colors";
import { useRoute } from "@react-navigation/native";

const FindingDrivers = ({ navigation, setShowSettings }) => {
  const route = useRoute();

  useEffect(() => {
    setShowSettings(false);
  }, []);

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
        onPress={() => {
          route.params.cleanupDrivers();
          navigation.navigate("Form");
        }}
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
