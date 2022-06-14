import { React, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colors from "../core/Colors";

const OrderRequest = ({ setOrig, setDest }) => {
  const [recipientName, setRecipientName] = useState("");
  const [recipientTel, setRecipientTel] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState(2.6);
  const [price, setPrice] = useState(7.0);

  const send = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <GooglePlacesAutocomplete
        styles={styles.inputStyles}
        textInputProps={{
          placeholderTextColor: "#5d5d5d",
        }}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          setOrig({
            location: details.geometry.location,
            shortAddress: details.name,
            address: details.formatted_address,
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
      <GooglePlacesAutocomplete
        styles={styles.inputStyles}
        textInputProps={{
          placeholderTextColor: "#5d5d5d",
        }}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          setDest({
            location: details.geometry.location,
            shortAddress: details.name,
            address: details.formatted_address,
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
        <Text h3 style={styles.distanceTitle}>
          Distance:
        </Text>
        <Text h2 style={styles.distance}>
          {distance >= 10 ? Math.round(distance) : distance.toFixed(1)} mi
        </Text>
        <Text h1 style={styles.price}>
          £{price.toFixed(2)}
        </Text>
      </View>
      <Button
        title="Send Parcel"
        raised
        onPress={send}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitle}
      />
    </KeyboardAvoidingView>
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
    position: "absolute",
    bottom: 0,
    height: "45%",
    width: "100%",
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
  },

  dimensions: {
    fontSize: 13,
    textAlign: "center",
  },

  distanceTitle: {
    fontWeight: "500",
  },

  distance: {
    fontWeight: "500",
    paddingLeft: 10,
  },

  inputStyles: {
    textInput: {
      width: "100%",
      height: 44,
      fontSize: 18,
      backgroundColor: "whitesmoke",
      marginTop: 3,
      marginHorizontal: 6,
      paddingHorizontal: 4,
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

  price: {
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
