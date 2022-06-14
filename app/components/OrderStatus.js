import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-elements";
import Colors from "../core/Colors";

const PickupScreen = ({ orderStatus, navigation }) => {
  const [minutesLeft, setMinutesLeft] = useState(
    getMinutesLeft(orderStatus?.time.toDate())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesLeft(getMinutesLeft(orderStatus?.time.toDate()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        </View>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Text style={[styles.allText, styles.timeText]}>
            {getTimeText(orderStatus?.status)}
          </Text>
          <Text h2 style={[styles.allText, styles.time]}>
            {orderStatus?.status != "Delivered" &&
              orderStatus?.time
                .toDate()
                .toLocaleTimeString("en-GB")
                .substring(0, 5)}
          </Text>
        </View>
        <View style={styles.minutesContainer}>
          <Text h2 style={[styles.allText]}>
            {orderStatus?.status == "Delivered"
              ? orderStatus?.time
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
              onPress={() => navigation.navigate("Home")}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default PickupScreen;

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
    marginTop: 12,
    width: 200,
    borderRadius: 6,
  },

  buttonTitleStyle: { fontWeight: "500" },

  container: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    height: "45%",
    width: "100%",
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
    // justifyContent: "center",
  },

  driverName: {
    color: "white",
    textAlign: "center",
    top: "40%",
  },

  icon: {
    width: 50,
    height: 50,
    position: "absolute",
    right: 15,
  },

  minutesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
  },

  statusContainer: {
    height: "18%",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
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
