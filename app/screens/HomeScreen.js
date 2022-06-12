import React from "react";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../core/Config";
import OrderStatus from "../components/OrderStatus";

const userPhone = "0123456789";
const orderDoc = doc(db, "UserOrders", userPhone);

const HomeScreen = () => {
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    return onSnapshot(orderDoc, (doc) => {
      setOrderStatus(doc.data());
    });
  }, []);

  return (
    <View style={styles.container}>
      {orderStatus ? <OrderStatus orderStatus={orderStatus} /> : <></>}
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
