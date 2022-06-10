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
        <Text h2 style={styles.allText}>
          {orderStatus?.status}
        </Text>
      </View>
      <View style={styles.driverContainer}>
        <Text style={[styles.allText, styles.driverText]}>
          Your parcel will be picked up by:
        </Text>
        <Text h2 style={[styles.allText, styles.driverText, styles.driverName]}>
          {orderStatus?.driver.name}
        </Text>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Text style={[styles.allText]}>Your driver will be arriving at:</Text>
          <Text h2 style={[styles.allText, styles.time]}>
            {orderStatus?.time.toDate().getHours()}:
            {orderStatus?.time.toDate().getMinutes()}
          </Text>
        </View>
        <Text h2 style={[styles.allText, styles.minutesLeft]}>
          In {Math.floor((orderStatus?.time.toDate() - Date.now()) / 60000)}{" "}
          mins
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

  allText: {
    fontWeight: "700",
    fontSize: 18,
  },

  driverContainer: {
    backgroundColor: Colors.secondary,
    height: "40%",
    // padding: 15,
  },
  driverText: {
    color: "white",
    padding: 15,
  },
  driverName: {
    textAlign: "center",
  },
  timeContainer: {
    height: "40%",
    paddingLeft: 15,
    paddingTop: 5,
  },
  timeRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  time: {
    flexGrow: 1,
    textAlign: "center",
  },
  minutesLeft: {
    textAlign: "center",
    padding: 15,
  },
});
