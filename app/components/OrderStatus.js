import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text, Button } from "react-native-elements";
import Colors from "../core/Colors";
import { db } from "../core/Config";
import { doc, runTransaction } from "firebase/firestore";

const OrderStatus = ({
  navigation,
  orderStatus,
  setShowSettings,
  userProfile,
  setOrig,
  setDest,
}) => {
  const [minutesLeft, setMinutesLeft] = useState(
    getMinutesLeft(
      orderStatus?.status === "Picking Up"
        ? orderStatus?.pickupTime.toDate()
        : orderStatus?.dropoffTime.toDate()
    )
  );

  useEffect(() => {
    setShowSettings(false);

    const interval = setInterval(() => {
      setMinutesLeft(
        getMinutesLeft(
          orderStatus?.status === "Picking Up"
            ? orderStatus?.pickupTime.toDate()
            : orderStatus?.dropoffTime.toDate()
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const closeOrder = async () => {
    setOrig(null);
    setDest(null);
    navigation.navigate("Form");

    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, "UserOrders", userProfile.phone);
        const orderDoc = await transaction.get(orderRef);
        if (
          orderDoc.exists() &&
          orderDoc.data().status === "Delivered" // Ensure it hasn't been overwritten by another user request
        ) {
          transaction.delete(orderRef);
        }
      });
      console.log("Successfully deleted delivered user order");
    } catch (e) {
      console.log("Deleting delivered user order. Transaction failed: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text h2 style={styles.allText}>
          {orderStatus?.status}
        </Text>
        {getIcon(orderStatus?.status)}
      </View>
      <View style={styles.driverContainer}>
        <Text style={[styles.allText, styles.driverText]}>
          {getDriverText(orderStatus?.status)}
        </Text>
        <View style={styles.driverNameContainer}>
          <Text h2 style={[styles.allText, styles.driverName]}>
            {orderStatus?.driver.name}
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {
              Linking.openURL(`tel: ${orderStatus.driver.phone}`);
            }}
          >
            <Text style={styles.callText}>CALL</Text>
            <Image
              source={require("../assets/phone.png")}
              style={styles.callIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Text style={[styles.allText, styles.timeText]}>
            {getTimeText(orderStatus?.status)}
          </Text>
          <Text h2 style={[styles.allText, styles.time]}>
            {orderStatus?.status != "Delivered" &&
              (orderStatus?.status === "Picking Up"
                ? orderStatus?.pickupTime.toDate()
                : orderStatus?.dropoffTime.toDate()
              )
                .toLocaleTimeString("en-GB")
                .substring(0, 5)}
          </Text>
        </View>
        <View style={styles.minutesContainer}>
          <Text h2 style={[styles.allText]}>
            {orderStatus?.status == "Delivered"
              ? orderStatus?.dropoffTime
                  .toDate()
                  .toLocaleTimeString("en-GB")
                  .substring(0, 5)
              : `In ${minutesLeft} mins`}
          </Text>
          {orderStatus?.status == "Delivered" && (
            <Button
              title="Close"
              raised={true}
              buttonStyle={styles.buttonStyle}
              containerStyle={styles.buttonContainerStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={closeOrder}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default OrderStatus;

const getMinutesLeft = (time) => {
  const NANOSECONDS_IN_MINUTE = 60000;
  return Math.max(0, Math.ceil((time - Date.now()) / NANOSECONDS_IN_MINUTE));
};

const getIcon = (status) => {
  switch (status) {
    case "Picking Up":
      return (
        <Image source={require("../assets/pickup.png")} style={styles.icon} />
      );
    case "Delivering":
      return (
        <Image
          source={require("../assets/delivering.png")}
          style={styles.icon}
        />
      );
    case "Delivered":
      return (
        <Image
          source={require("../assets/delivered.png")}
          style={styles.icon}
        />
      );
  }
};

const getDriverText = (status) => {
  switch (status) {
    case "Picking Up":
      return "Your parcel will be picked up by:";
    case "Delivering":
      return "Your parcel is being delivered by:";
    case "Delivered":
      return "Your parcel has been delivered by:";
  }
};

const getTimeText = (status) => {
  switch (status) {
    case "Picking Up":
      return "Your driver will be arriving at:";
    case "Delivering":
      return "Your parcel will be arriving at:";
    case "Delivered":
      return "Your parcel has been delivered at:";
  }
};

const styles = StyleSheet.create({
  allText: {
    fontWeight: "700",
    fontSize: 18,
  },

  buttonStyle: {
    backgroundColor: Colors.dark,
    borderRadius: 6,
  },

  buttonContainerStyle: {
    // marginTop: 12,
    width: 200,
    borderRadius: 6,
  },

  buttonTitleStyle: { fontWeight: "500" },

  callButton: {
    backgroundColor: "white",
    flexDirection: "row",
    width: 90,
    height: 27,
    borderRadius: 12,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2.5,
    elevation: 5,
  },

  callIcon: {
    width: 22,
    height: 22,
    marginLeft: 6,
  },

  callText: {
    fontWeight: "700",
    fontSize: 16,
  },

  container: {
    backgroundColor: "white",
  },

  driverContainer: {
    backgroundColor: Colors.primary,
    height: "38%",
  },

  driverText: {
    color: "white",
    marginLeft: 15,
    marginTop: 15,
  },

  driverNameContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "5%",
  },

  driverName: {
    color: "white",
  },

  icon: {
    width: 50,
    height: 50,
  },

  minutesContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 20,
  },

  statusContainer: {
    height: "18%",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  timeContainer: {
    height: "44%",
  },

  timeRow: {
    flexDirection: "row",
  },

  timeText: {
    marginTop: 15,
    marginLeft: 15,
  },

  time: {
    flexGrow: 1,
    textAlign: "center",
    marginTop: 5,
  },
});
