import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Map from "../components/Map";
import OrderRequest from "../components/OrderRequest";
import OrderStatus from "../components/OrderStatus";
import { db } from "../core/Config";

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
      <Map style={{ flex: 1 }} />
      {orderStatus ? (
        <OrderStatus orderStatus={orderStatus} />
      ) : (
        <OrderRequest />
      )}
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
