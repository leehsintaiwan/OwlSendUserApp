import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { db } from "../core/Config";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

const PickupScreen = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const userPhone = "0123456789";
  const orderDoc = doc(db, "UserOrders", userPhone);

  const ReadOrderStatus = () => {
    getDoc(orderDoc).then((snapshot) => {
      if (snapshot.exists) {
        setOrderStatus(snapshot.data());
        // console.log(snapshot.time.toString());
      } else {
        alert("No order found for this user");
      }
    });
  };

  useEffect(() => {
    ReadOrderStatus();
  });

  return (
    <View>
      <View>
        <Text>{orderStatus != null && orderStatus.status}</Text>
      </View>
      <View>
        <Text>
          Your parcel will be picked up by:
          {orderStatus != null && orderStatus.driver.name}
        </Text>
      </View>
      <View>
        <Text>
          Your driver will be arriving at:
          {orderStatus != null && orderStatus.time.toDate().getHours()}:
          {orderStatus != null && orderStatus.time.toDate().getMinutes()}
        </Text>
      </View>
    </View>
  );
};

export default PickupScreen;

const styles = StyleSheet.create({});
