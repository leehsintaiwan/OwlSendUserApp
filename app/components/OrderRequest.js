import {React, useState} from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colors from "../core/Colors";
import { Button, Image, Input, Text, ButtonGroup } from "react-native-elements";

const OrderRequest = ({ setOrigin, setDestination }) => {

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [tel, setTel] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const register = () => {};



  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        styles={styles.inputStyles}
        onPress={(data, details = null) => {
          setOrigin({
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
        onPress={(data, details = null) => {
          setDestination({
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
  <View style={styles.inputContainer}>
        <View style={{ flexDirection: "row" }}>
          <Input
            containerStyle={{ width: "50%" }}
            placeholder="First Name"
            type="text"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <Input
            containerStyle={{ width: "50%" }}
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>
        <Input
          placeholder="Phone number"
          type="tel"
          value={tel}
          onChangeText={(text) => setTel(text)}
          keyboardType={"phone-pad"}
          onSubmitEditing={register}
        />
      </View>
      <Text style={{ color: "grey", marginLeft: 10 }}>
          How large is your parcel?
        </Text>
        <View style={{ width: "25%", flexDirection: "row" }}>
          <Input
            placeholder="Length (cm)"
            keyboardType="numeric"
            value={length}
            onChangeText={(text) => setLength(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Width (cm)"
            keyboardType="numeric"
            value={width}
            onChangeText={(text) => setWidth(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={(text) => setHeight(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={(text) => setWeight(text)}
            style={styles.sizeField}
          />
        </View>
        <Button
        title="Send Parcel"
        raised
        onPress={register}
        containerStyle={styles.button}
        buttonStyle={styles.buttonStyle}
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
