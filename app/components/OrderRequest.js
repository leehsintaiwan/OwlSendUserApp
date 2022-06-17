import { React, useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colors from "../core/Colors";
import * as Location from "expo-location";
import { db } from "../core/Config";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  GeoPoint,
  collection,
  query,
  where,
  getDoc,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Price = Distance in miles * PRICE_FACTOR
const PRICE_FACTOR = 2;
// Time out time for requesting drivers
const TIME_OUT_SECONDS = 300;

const OrderRequest = ({
  navigation,
  orig,
  dest,
  setOrig,
  setDest,
  userProfile,
  currentLocation,
  setShowSettings,
  distance,
}) => {
  const [recipientName, setRecipientName] = useState("");
  const [recipientTel, setRecipientTel] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState(0.0);
  const refOrig = useRef();
  const refDest = useRef();

  // Variables for requesting drivers
  let acceptedDriver = null;
  const unsubscribes = [];
  const requestedDrivers = [];
  let timer = null;

  useEffect(() => {
    setShowSettings(true);

    if (orig) {
      refOrig.current?.setAddressText(orig.address);
    }

    if (dest) {
      refDest.current?.setAddressText(dest.address);
    }
  }, []);

  useEffect(() => {
    setPrice(distance * PRICE_FACTOR);
  }, [distance]);

  // Search on Firebase for drivers to fulfill order
  const handleSend = () => {
    navigation.navigate("Finding", { cleanupDrivers });

    requestDrivers();

    waitForDrivers();

    timer = setTimeout(() => {
      cleanupDrivers();
      navigation.navigate("Form");
      Alert.alert("Sorry, unable to find drivers to fulfill your order.");
    }, TIME_OUT_SECONDS * 1000);
  };

  const requestDrivers = () => {
    const q = query(
      collection(db, "RegisteredDrivers"),
      where("online", "==", true),
      where("available", "==", true)
    );

    unsubscribes.push(
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const driverPhone = change.doc.id;
          const requestedIds = requestedDrivers.map((driver) => driver.id);
          if (change.type === "added" && !requestedIds.includes(driverPhone)) {
            console.log("Sending Request to Driver: ", driverPhone);

            const newDoc = doc(db, "DriverOrders", driverPhone);

            const docData = {
              userPhone: userProfile.phone,
              status: "pending",
              price: price,
              pickup: {
                type: "Pickup",
                name: userProfile.firstName + " " + userProfile.lastName,
                phone: userProfile.phone,
                address: orig.address,
                shortAddress: orig.shortAddress,
                postcode: orig.postcode,
                location: new GeoPoint(
                  orig.location.latitude,
                  orig.location.longitude
                ),
                // arriveBy:
              },
              dropoff: {
                type: "Deliver",
                name: recipientName,
                phone: recipientTel,
                address: dest.address,
                shortAddress: dest.shortAddress,
                postcode: dest.postcode,
                location: new GeoPoint(
                  dest.location.latitude,
                  dest.location.longitude
                ),
                // arriveBy:
              },
            };

            await setDoc(newDoc, docData);
            requestedDrivers.push(newDoc);
          }
        });
      })
    );
  };

  const waitForDrivers = () => {
    const q = query(
      collection(db, "DriverOrders"),
      where("status", "==", "accepted")
    );

    unsubscribes.push(
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const driverPhone = change.doc.id;

            // Update driver order status to pickup straight away for this week without chaining
            const driverOrderDoc = doc(db, "DriverOrders", driverPhone);
            await updateDoc(driverOrderDoc, { status: "pickup" });
            acceptedDriver = driverOrderDoc.id;

            // Get driver name from registered drivers
            const driverDoc = doc(db, "RegisteredDrivers", driverPhone);
            const driver = (await getDoc(driverDoc)).data();

            console.log("Accepted by Driver: ", driverPhone, driver.name);

            const newDoc = doc(db, "UserOrders", userProfile.phone);

            const docData = {
              status: "Picking Up",
              time: Timestamp.fromMillis(Date.now() + 10 * 60 * 1000), // pickup in 10 mins
              pickup: {
                shortAddress: orig.shortAddress,
                location: new GeoPoint(
                  orig.location.latitude,
                  orig.location.longitude
                ),
              },
              dropoff: {
                shortAddress: dest.shortAddress,
                location: new GeoPoint(
                  dest.location.latitude,
                  dest.location.longitude
                ),
              },
              driver: { name: driver.name, phone: driverPhone },
            };

            await setDoc(newDoc, docData);

            navigation.navigate("Home", { screen: "Status" });
            cleanupDrivers();
            return;
          }
        });
      })
    );
  };

  const cleanupDrivers = () => {
    clearTimeout(timer);
    requestedDrivers.forEach(async (driverRef) => {
      if (driverRef.id != acceptedDriver) {
        console.log("Cancelling Driver Request: ", driverRef.id);
        try {
          await runTransaction(db, async (transaction) => {
            const driverDoc = await transaction.get(driverRef);
            if (
              driverDoc.exists() &&
              driverDoc.data().userPhone === userProfile.phone // Ensure it hasn't been overwritten by another user request
            ) {
              transaction.delete(driverRef);
            }
          });
          console.log("Successfully canceled all other driver requests");
        } catch (e) {
          console.log(
            "Canceling all other driver requests. Transaction failed: ",
            e
          );
        }
      }
    });

    unsubscribes.forEach((unsub) => {
      unsub();
    });
  };

  const useCurrentLocation = async () => {
    const { latitude, longitude } = currentLocation;
    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    let address = `${response[0].name}, ${response[0].street}, ${response[0].city}, ${response[0].postalCode}`;
    refOrig.current?.setAddressText(address);

    setOrig({
      location: {
        latitude,
        longitude,
      },
      address: address,
      shortAddress: response[0].name,
      postcode: response[0].postalCode,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <GooglePlacesAutocomplete
          ref={refOrig}
          styles={styles.inputStyles}
          textInputProps={{
            placeholderTextColor: "#5d5d5d",
          }}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            setOrig({
              location: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
              address: data.description,
              shortAddress: details.name,
              postcode: details.address_components.slice(-1)[0].long_name,
            });
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          placeholder="Pickup Address"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          query={{
            key: "AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY",
            language: "en",
          }}
        />
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => {
              useCurrentLocation();
            }}
          >
            <FontAwesome
              name="location-arrow"
              size={35}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <GooglePlacesAutocomplete
        ref={refDest}
        styles={styles.inputStyles}
        textInputProps={{
          placeholderTextColor: "#5d5d5d",
        }}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          setDest({
            location: {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            },
            address: data.description,
            shortAddress: details.name,
            postcode: details.address_components.slice(-1)[0].long_name,
          });
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        placeholder="Dropoff Address"
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        query={{
          key: "AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY",
          language: "en",
        }}
      />

      <View style={styles.recipientContainer}>
        <Input
          containerStyle={{ width: "50%" }}
          placeholder="Recipient's Name"
          type="text"
          value={recipientName}
          onChangeText={(text) => setRecipientName(text)}
        />
        <Input
          containerStyle={{ width: "50%" }}
          placeholder="Recipient's Phone"
          type="tel"
          value={recipientTel}
          onChangeText={(text) => setRecipientTel(text)}
          keyboardType={"phone-pad"}
        />
      </View>

      <Text style={styles.dimensionsTitle}>How large is your parcel?</Text>
      <View style={styles.dimensionsContainer}>
        <Input
          containerStyle={{ width: "25%", marginBottom: 0 }}
          placeholder="Length (cm)"
          keyboardType="numeric"
          value={length}
          onChangeText={(text) => setLength(text)}
          style={styles.dimensions}
        />
        <Input
          containerStyle={{ width: "25%", marginBottom: 0 }}
          placeholder="Width (cm)"
          keyboardType="numeric"
          value={width}
          onChangeText={(text) => setWidth(text)}
          style={styles.dimensions}
        />
        <Input
          containerStyle={{ width: "25%", marginBottom: 0 }}
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={(text) => setHeight(text)}
          style={styles.dimensions}
        />
        <Input
          containerStyle={{ width: "25%", marginBottom: 0 }}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={(text) => setWeight(text)}
          style={styles.dimensions}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text
          h3
          numberOfLines={1}
          adjustsFontSizeToFit
          style={styles.distanceTitle}
        >
          Distance:
        </Text>
        <Text h2 numberOfLines={1} adjustsFontSizeToFit style={styles.distance}>
          {distance} mi
        </Text>
        <Text h1 numberOfLines={1} adjustsFontSizeToFit style={styles.price}>
          {new Intl.NumberFormat("en-UK", {
            style: "currency",
            currency: "GBP",
          }).format(price)}
        </Text>
      </View>
      <Button
        title="Send Parcel"
        raised
        onPress={handleSend}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitle}
      />
    </View>
  );
};

export default OrderRequest;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 300,
    alignSelf: "center",
    borderRadius: 6,
    marginBottom: 25,
  },

  buttonStyle: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },

  buttonTitle: {
    fontWeight: "500",
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 5,
  },

  dimensionsContainer: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
  },

  dimensionsTitle: {
    fontSize: 16,
    color: "grey",
    marginLeft: 10,
    flexGrow: 1,
  },

  dimensions: {
    fontSize: 13,
    textAlign: "center",
  },

  distanceTitle: {
    fontWeight: "500",
    width: "32%",
  },

  distance: {
    fontWeight: "500",
    paddingLeft: 5,
    width: "30%",
  },

  inputStyles: {
    textInput: {
      width: "100%",
      height: 44,
      fontSize: 18,
      backgroundColor: "whitesmoke",
      marginTop: 3,
      marginHorizontal: 6,
      paddingLeft: 4,
      paddingRight: 40,
    },
    container: {
      flex: 0,
    },
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    flexGrow: 1,
  },

  locationButton: {},

  locationContainer: {
    position: "absolute",
    right: 35,
    top: 8,
  },

  price: {
    width: "35%",
    textAlign: "right",
    fontWeight: "500",
    position: "absolute",
    right: 10,
  },

  recipientContainer: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    marginTop: 3,
  },
});
