import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import Colors from "../core/Colors";

const OrderRequest = () => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        styles={styles.inputStyles}
        onPress={(data, details = null) => {
          dispatch(
            setOrigin({
              location: details.geometry.location,
              description: data.description,
            })
          );
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        placeholder="Pickup address"
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
          dispatch(
            setDestination({
              location: details.geometry.location,
              description: data.description,
            })
          );
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        placeholder="Dropoff address"
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
    position: "absolute",
    bottom: 0,
    height: "80%",
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
  }
});