import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import FindingDrivers from "../components/FindingDrivers";
import Map from "../components/Map";
import OrderRequest from "../components/OrderRequest";
import OrderStatus from "../components/OrderStatus";
import { db } from "../core/Config";

const HomeScreen = ({ navigation, userProfile }) => {
  const orderDoc = doc(db, "UserOrders", userProfile.phone);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orig, setOrig] = useState(null);
  const [dest, setDest] = useState(null);

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <Map orig={orig} dest={dest} />
      {orderStatus ? (
        <OrderStatus orderStatus={orderStatus} navigation={navigation} />
      ) : (
        <FindingDrivers />
        // <OrderRequest
        //   setOrig={setOrig}
        //   setDest={setDest}
        //   userProfile={userProfile}
        // />
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
