import React from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colors from "../core/Colors";

const OrderRequest = ({ setOrigin, setDestination }) => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        styles={styles.inputStyles}
        onPress={(data, details = null) => {
          setOrigin({
            location: details.geometry.location,
            description: details.name,
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
      <GooglePlacesAutocomplete
        styles={styles.inputStyles}
        onPress={(data, details = null) => {
          setDestination({
            location: details.geometry.location,
            description: details.name,
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
    </View>
  );
};

export default OrderRequest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
  },

  inputStyles: {
    textInputContainer: {
      backgroundColor: Colors.primary,
    },
    textInput: {
      height: 38,
      color: "#5d5d5d",
      fontSize: 16,
    },
    container: {
      flex: 0,
    },
  },
});
