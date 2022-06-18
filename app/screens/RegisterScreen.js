import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import Colors from "../core/Colors";

const RegisterScreen = ({ navigation, userProfile, setUserProfile }) => {
  const [tel, setTel] = useState(userProfile?.phone);
  const [firstName, setFirstName] = useState(userProfile?.firstName);
  const [lastName, setLastName] = useState(userProfile?.lastName);

  useEffect(() => {
    if (userProfile) {
      navigation.navigate("Home");
    }
  }, []);

  const register = async () => {
    const profile = { firstName: firstName, lastName: lastName, phone: tel };

    // Save user profile into persistent storage on device.
    try {
      await AsyncStorage.setItem("profile", JSON.stringify({ profile }));
    } catch (e) {
      console.log(e);
    }

    setUserProfile(profile);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image
          source={require("../assets/owl-send-logo-transparent-bg.png")}
          style={{ width: "100%", height: 170 }}
        />
        <Text h4 style={{ marginTop: 20, marginBottom: 10, fontWeight: "700" }}>
          Create an User Account
        </Text>
        <View style={styles.inputContainer}>
          <View style={{ flexDirection: "row" }}>
            <Input
              containerStyle={{ width: "50%" }}
              placeholder="First Name"
              type="text"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <Input
              containerStyle={{ width: "50%" }}
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
          </View>
          <Input
            placeholder="Phone Number"
            type="tel"
            value={tel}
            onChangeText={(text) => setTel(text)}
            keyboardType={"phone-pad"}
          />
        </View>
        <Button
          buttonStyle={styles.buttonStyle}
          title="Continue"
          containerStyle={styles.button}
          onPress={register}
          titleStyle={styles.buttonTitle}
          disabled={!firstName || !lastName || !tel}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: "100%",
  },
  button: {
    width: "60%",
    marginTop: 10,
  },
  buttonStyle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonTitle: {
    fontWeight: "500",
  },
});
