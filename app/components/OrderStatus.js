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
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text h3 style={styles.status}>
          {orderStatus?.status}
        </Text>
      </View>
      <View style={styles.driverContainer}>
        <Text style={styles.driverText}>Your parcel will be picked up by:</Text>
        <Text h3 style={[styles.driverText, styles.driverName]}>
          {orderStatus?.driver.name}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          Your driver will be arriving at:
          <Text h3>
            {orderStatus?.time.toDate().getHours()}:
            {orderStatus?.time.toDate().getMinutes()}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default PickupScreen;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: "45%",
    width: "100%",
  },

  statusContainer: {
    height: "20%",
    justifyContent: "center",
    padding: 15,
  },

  status: {
    fontWeight: "700",
  },

  driverContainer: {
    backgroundColor: Colors.primary,
    height: "40%",
  },
  driverText: {
    color: "white",
    fontWeight: "700",
    padding: 15,
  },
  driverName: {
    textAlign: "center",
  },
  timeContainer: {
    height: "40%",
    paddingLeft: 15,
  },
  timeText: {
    fontWeight: "700",
  },
});
