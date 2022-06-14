import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Colors from "../core/Colors";
import * as Location from "expo-location";

const Map = ({ orig, dest }) => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 51.498733, // This is the Geoloaction of Huxley!
    longitude: -0.179461, // Change to user's current location later on.
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setCurrentLocation(location.coords);
  };

  useEffect(() => {
    if (!orig || !dest) return;
    mapRef.current.fitToSuppliedMarkers(["orig", "dest"], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    });
    getCurrentLocation();
  }, [orig, dest]);

  return (
    <MapView
      provider={MapView.PROVIDER_GOOGLE}
      ref={mapRef}
      style={{ flex: 1 }}
      mapType="mutedStandard"
      region={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
    >
      {orig && (
        <Marker
          coordinate={{
            latitude: orig.location.lat,
            longitude: orig.location.lng,
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
            latitude: dest.location.lat,
            longitude: dest.location.lng,
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
            latitude: orig.location.lat,
            longitude: orig.location.lng,
          }}
          destination={{
            latitude: dest.location.lat,
            longitude: dest.location.lng,
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
