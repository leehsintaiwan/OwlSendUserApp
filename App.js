import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import HomeScreen from "./app/screens/HomeScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import SplashScreen from "./app/screens/SplashScreen";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const getUserProfile = async () => {
    // Get user profile from device storage.
    // AsyncStorage.clear(); // Uncomment to clear user profile
    try {
      const user = JSON.parse(await AsyncStorage.getItem("profile"));
      if (user) {
        setUserProfile(user.profile);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const Home = () => {
    return (
      <HomeScreen userProfile={userProfile} setUserProfile={setUserProfile} />
    );
  };

  const Register = () => {
    return <RegisterScreen setUserProfile={setUserProfile} />;
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userProfile ? (
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
