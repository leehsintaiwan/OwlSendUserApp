import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { Text } from "react-native-elements";

import { db } from "../core/Config";
import Colors from "../core/Colors";

const PickupScreen = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const userPhone = "0123456789";
  const orderDoc = doc(db, "UserOrders", userPhone);

  useEffect(() => {
    return onSnapshot(orderDoc, (doc) => {
      setOrderStatus(doc.data());
    });
  }, []);

  return (
    <View style={styles.popupContainer}>
      <View>
        <Text h1>{orderStatus?.status}</Text>
      </View>
      <View style={styles.driverContainer}>
        <Text style={styles.driverText}>
          Your parcel will be picked up by:
          {orderStatus?.driver.name}
        </Text>
      </View>
      <View>
        <Text>
          Your driver will be arriving at:
          {orderStatus?.time.toDate().getHours()}:
          {orderStatus?.time.toDate().getMinutes()}
        </Text>
      </View>
    </View>
  );
};

export default PickupScreen;

const styles = StyleSheet.create({
  popupContainer: {},

  driverContainer: {
    backgroundColor: Colors.primary,
  },
  driverText: {
    color: "white",
  },
});
