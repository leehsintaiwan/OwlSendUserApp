import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import Colors from "../core/Colors";

const NANOSECONDS_IN_MINUTE = 60000;

const PickupScreen = ({ orderStatus }) => {
  const [minutesLeft, setMinutesLeft] = useState(null);

  useEffect(() => {
    setMinutesLeft(
      Math.max(
        0,
        Math.ceil(
          (orderStatus?.time.toDate() - Date.now()) / NANOSECONDS_IN_MINUTE
        )
      )
    );

    const interval = setInterval(() => {
      setMinutesLeft(
        Math.max(
          0,
          Math.ceil(
            (orderStatus?.time.toDate() - Date.now()) / NANOSECONDS_IN_MINUTE
          )
        )
      );
    }, 1000);
    return () => clearInterval(interval);
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
        <View style={styles.driverNameContainer}>
          <Text h2 style={[styles.allText, styles.driverName]}>
            {orderStatus?.driver.name}
          </Text>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Text style={[styles.allText]}>Your driver will be arriving at:</Text>
          <Text h2 style={[styles.allText, styles.time]}>
            {orderStatus?.time
              .toDate()
              .toLocaleTimeString("en-GB")
              .substring(0, 5)}
          </Text>
        </View>
        <View style={styles.minutesContainer}>
          <Text h2 style={[styles.allText]}>
            In {minutesLeft} mins
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PickupScreen;

const styles = StyleSheet.create({
  allText: {
    fontWeight: "700",
    fontSize: 18,
  },

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

  minutesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  statusContainer: {
    height: "18%",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  timeContainer: {
    height: "44%",
  },

  timeRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingTop: 5,
  },

  time: {
    flexGrow: 1,
    textAlign: "center",
  },
});
