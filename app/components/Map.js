import React, { useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Colors from "../core/Colors";

const Map = ({ orig, dest, currentLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (orig && dest) {
      mapRef.current.fitToSuppliedMarkers(["orig", "dest"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    } else if (orig) {
      mapRef.current.animateToRegion(
        {
          latitude: orig.location.latitude,
          longitude: orig.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        250
      );
    } else if (dest) {
      mapRef.current.animateToRegion(
        {
          latitude: dest.location.latitude,
          longitude: dest.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        250
      );
    }
  }, [orig, dest]);

  useEffect(() => {
    mapRef.current.animateToRegion(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1
    );
  }, [currentLocation]);

  return (
    <MapView
      provider={MapView.PROVIDER_GOOGLE}
      ref={mapRef}
      style={{ flex: 1 }}
      mapType="mutedStandard"
      initialRegion={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {orig && (
        <Marker
          coordinate={{
            latitude: orig.location.latitude,
            longitude: orig.location.longitude,
          }}
          title="Pickup"
          description={orig.shortAddress}
          identifier="orig"
          image={require("../assets/location.png")}
        />
      )}
      {dest && (
        <Marker
          coordinate={{
            latitude: dest.location.latitude,
            longitude: dest.location.longitude,
          }}
          title="Dropoff"
          description={dest.shortAddress}
          identifier="dest"
          image={require("../assets/destination.png")}
        />
      )}
      {orig && dest && (
        <MapViewDirections
          origin={{
            latitude: orig.location.latitude,
            longitude: orig.location.longitude,
          }}
          destination={{
            latitude: dest.location.latitude,
            longitude: dest.location.longitude,
          }}
          apikey="AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"
          strokeWidth={3}
          strokeColor={Colors.primary}
        />
      )}
    </MapView>
  );
};

export default Map;
