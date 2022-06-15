import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import HomeScreen from "./app/screens/HomeScreen";
import RegisterScreen from "./app/screens/RegisterScreen";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [userProfile, setUserProfile] = useState(null);

  const getUserProfile = async () => {
    // Get user profile from device storage.
    // AsyncStorage.clear(); // Uncomment to clear user profile
    try {
      const user = JSON.parse(await AsyncStorage.getItem("profile"));
      if (user) {
        setUserProfile(user.profile);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Home = ({ navigation, route }) => {
    return (
      <HomeScreen
        navigation={navigation}
        route={route}
        userProfile={userProfile}
      />
    );
  };

  const Register = ({ navigation, route }) => {
    return (
      <RegisterScreen
        navigation={navigation}
        route={route}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />
    );
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Stack.Navigator initialRouteName="Register">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </NavigationContainer>
  );
}
