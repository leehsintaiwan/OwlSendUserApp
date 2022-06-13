import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Image, Input, Text } from "react-native-elements";
import Colors from "../core/Colors";

const LoginScreen = ({ navigation }) => {
  const [tel, setTel] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const register = () => {
    console.log("login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      style={styles.container}
    >
      <Image
        source={require("../assets/owl-send-logo-transparent-bg.png")}
        style={{ width: "100%", height: "40%" }}
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
          placeholder="Phone number"
          type="tel"
          value={tel}
          onChangeText={(text) => setTel(text)}
          keyboardType={"phone-pad"}
          onSubmitEditing={register}
        />
      </View>
      <Button
        buttonStyle={styles.buttonStyle}
        title="Continue"
        containerStyle={styles.button}
        onPress={() => navigation.navigate("Home")}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
});
