import React from "react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../core/Config";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import tw from "twrnc";
import Map from "../components/Map";
import { setDestination, setOrigin } from "../slices/navSlice";
import OrderStatus from "../components/OrderStatus";
import OrderRequest from "../components/OrderRequest";

const userPhone = "0123456789";
const orderDoc = doc(db, "UserOrders", userPhone);

const HomeScreen = () => {
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    return onSnapshot(orderDoc, (doc) => {
      setOrderStatus(doc.data());
    });
  }, []);

  // return (
  // <View style={styles.container}>
  //   {orderStatus ? <OrderStatus orderStatus={orderStatus} /> : <></>}

  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Map />
      </View>
      <View style={styles.container}>
        <OrderRequest />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
