import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import tw from "twrnc";
import Map from "../components/Map";
import { setDestination, setOrigin } from "../slices/navSlice";
import OrderStatus from "../components/OrderStatus";
import OrderRequest from "../components/OrderRequest";

const HomeScreen = () => {
  const dispatch = useDispatch();
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Map />
      </View>
      <View style={styles.container}>
        <OrderRequest />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
