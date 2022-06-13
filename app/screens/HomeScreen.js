import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Map from "../components/Map";
import OrderRequest from "../components/OrderRequest";
import OrderStatus from "../components/OrderStatus";
import { db } from "../core/Config";

const userPhone = "012345678";
const orderDoc = doc(db, "UserOrders", userPhone);

const HomeScreen = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    return onSnapshot(orderDoc, (doc) => {
      setOrderStatus(doc.data());
    });
  }, []);

  return (
    <View style={styles.container}>
      <Map origin={origin} destination={destination} />
      {orderStatus ? (
        <OrderStatus orderStatus={orderStatus} />
      ) : (
        <OrderRequest setOrigin={setOrigin} setDestination={setDestination} />
      )}
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
