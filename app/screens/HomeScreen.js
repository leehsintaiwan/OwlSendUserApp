import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import FindingDrivers from "../components/FindingDrivers";
import Map from "../components/Map";
import OrderRequest from "../components/OrderRequest";
import OrderStatus from "../components/OrderStatus";
import { db } from "../core/Config";

const HomeScreen = ({ navigation, userProfile, route }) => {
  const orderDoc = doc(db, "UserOrders", userProfile.phone);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orig, setOrig] = useState(null);
  const [dest, setDest] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0, //51.498733, // This is the Geoloaction of Huxley!
    longitude: 0, //-0.179461, // Change to user's current location later on.
  });

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setCurrentLocation(location.coords);
  };

  useEffect(() => {
    getCurrentLocation();
    console.log(userProfile);

    return onSnapshot(orderDoc, (doc) => {
      setOrderStatus(doc.data());
    });
  }, []);

  useEffect(() => {
    if (orderStatus) {
      setOrig(orderStatus.pickup);
      setDest(orderStatus.dropoff);
    }
  }, [orderStatus]);

  const Form = () => {
    return (
      <OrderRequest
        orig={orig}
        dest={dest}
        setOrig={setOrig}
        setDest={setDest}
        userProfile={userProfile}
        orderStatus={orderStatus}
        currentLocation={currentLocation}
      />
    );
  };

  const Finding = () => {
    return <FindingDrivers orderStatus={orderStatus} />;
  };

  const Status = () => {
    return <OrderStatus orderStatus={orderStatus} />;
  };

  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.55 }}>
        <Map orig={orig} dest={dest} currentLocation={currentLocation} />
      </View>
      <View style={{ flex: 0.45 }}>
        <Stack.Navigator initialRouteName="Form">
          <Stack.Screen
            name="Form"
            component={Form}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Finding"
            component={Finding}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Status"
            component={Status}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
