import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FindingDrivers from "../components/FindingDrivers";
import Map from "../components/Map";
import OrderRequest from "../components/OrderRequest";
import OrderStatus from "../components/OrderStatus";
import Colors from "../core/Colors";
import { db } from "../core/Config";

const HomeScreen = ({ navigation, userProfile }) => {
  const orderDoc = doc(db, "UserOrders", userProfile.phone);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orig, setOrig] = useState(null);
  const [dest, setDest] = useState(null);
  const [distance, setDistance] = useState(0.0);
  const [minutes, setMinutes] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 51.498733, // This is the Geoloaction of Huxley!
    longitude: -0.179461, // Change to user's current location later on.
  });
  const [showSettings, setShowSettings] = useState(true);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setCurrentLocation(location.coords);
  };

  const getDistance = async () => {
    if (!orig || !dest) return setDistance(0.0);

    fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${
        orig.address
      }&destinations=${
        dest.address
      }&units=imperial&key=${"AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDistance(
          data.rows[0].elements[0].distance
            ? parseFloat(
                data.rows[0].elements[0].distance.text
                  .replace(",", "")
                  .split(" ")[0]
              )
            : "Unreachable"
        );
        setMinutes(
          data.rows[0].elements[0].duration.value / 60
        )
      });
  };

  useEffect(() => {
    getCurrentLocation();

    return onSnapshot(orderDoc, (doc) => {
      setOrderStatus(doc.data());
    });
  }, []);

  useEffect(() => {
    if (orderStatus) {
      setOrig(orderStatus.pickup);
      setDest(orderStatus.dropoff);
      navigation.navigate("Home", { screen: "Status" });
    } else {
      setOrig(null);
      setDest(null);
      navigation.navigate("Home", { screen: "Form" });
    }
  }, [orderStatus]);

  useEffect(() => {
    getDistance();
  }, [orig, dest]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  const Form = () => {
    return (
      <OrderRequest
        navigation={navigation}
        userProfile={userProfile}
        orig={orig}
        dest={dest}
        setOrig={setOrig}
        setDest={setDest}
        currentLocation={currentLocation}
        setShowSettings={setShowSettings}
        distance={distance}
      />
    );
  };

  const Finding = () => {
    return (
      <FindingDrivers
        navigation={navigation}
        userProfile={userProfile}
        orig={orig}
        dest={dest}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
    );
  };

  const Status = () => {
    return (
      <OrderStatus
        navigation={navigation}
        orderStatus={orderStatus}
        setShowSettings={setShowSettings}
        userProfile={userProfile}
        setOrig={setOrig}
        setDest={setDest}
      />
    );
  };

  const Stack = createNativeStackNavigator();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={{ flex: 0.55 }}>
          <Map
            orig={orig}
            dest={dest}
            currentLocation={currentLocation}
            orderStatus={orderStatus}
          />
        </View>
        {showSettings && (
          <View style={styles.settingsIcon}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <FontAwesome name="cog" size={40} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  settingsIcon: {
    position: "absolute",
    top: "7%",
    right: "6%",
  },
});
