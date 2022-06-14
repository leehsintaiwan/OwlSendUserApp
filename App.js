import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import HomeScreen from "./app/screens/HomeScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [userProfile, setUserProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);

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
        setEditProfile={setEditProfile}
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
        setEditProfile={setEditProfile}
      />
    );
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        {userProfile && !editProfile ? (
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
