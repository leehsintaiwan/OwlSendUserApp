import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Colors from "../core/Colors";

const Map = ({ orig, dest, currentLocation }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  // useEffect(() => {
  //   if (!orig && !dest) {
  //     console.log(orig, dest);
  //     getCurrentLocation();
  //   }
  // }, []);

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

  // useEffect(() => {
  //   if (currentLocation && !orig && !dest) {
  //     mapRef.current.animateToRegion(
  //       {
  //         latitude: currentLocation.latitude,
  //         longitude: currentLocation.longitude,
  //         latitudeDelta: 0.05,
  //         longitudeDelta: 0.05,
  //       },
  //       0
  //     );
  //   }
  // }, [currentLocation]);

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
        >
          <Image
            source={require("../assets/location.png")}
            style={{ height: 25, width: 25 }}
          />
        </Marker>
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
        >
          <Image
            source={require("../assets/destination.png")}
            style={{ height: 25, width: 25 }}
          />
        </Marker>
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
