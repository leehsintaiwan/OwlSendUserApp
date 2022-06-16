import { React, useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
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
} from "firebase/firestore";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Price = Distance in miles * PRICE_FACTOR
const PRICE_FACTOR = 2;

const OrderRequest = ({
  navigation,
  orig,
  dest,
  setOrig,
  setDest,
  userProfile,
  orderStatus,
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

  const handleSend = () => {
    navigation.navigate("Finding");
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
          £{price.toFixed(2)}
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
    // backgroundColor: "red",
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
