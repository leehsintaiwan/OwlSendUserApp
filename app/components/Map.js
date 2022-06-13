import React, { useEffect, useRef } from "react";
import { Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const Map = ({ origin, destination }) => {
  const mapRef = useRef(null);
  const initialMapCenter = {
    location: {
      lat: 51.498733, // This is the Geoloaction of Huxley!
      lng: -0.179461, // Change to user's current location later on.
    },
  };

  useEffect(() => {
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    });
  }, [origin, destination]);

  return (
    <MapView
      provider={MapView.PROVIDER_GOOGLE}
      // showsUserLocation={true}
      // followsUserLocation={true}
      // showsMyLocationButton={true}
      ref={mapRef}
      style={{ flex: 1 }}
      mapType="mutedStandard"
      region={{
        latitude: initialMapCenter.location.lat,
        longitude: initialMapCenter.location.lng,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
    >
      {origin && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Pickup"
          description={origin.shortAddress}
          identifier="origin"
        >
          <Image
            source={require("../assets/location.png")}
            style={{ height: 25, width: 25 }}
          />
        </Marker>
      )}
      {destination && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Dropoff"
          description={destination.shortAddress}
          identifier="destination"
        >
          <Image
            source={require("../assets/destination.png")}
            style={{ height: 25, width: 25 }}
          />
        </Marker>
      )}
      {origin && destination && (
        <MapViewDirections
          origin={origin.shortAddress}
          destination={destination.shortAddress}
          apikey="AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"
          strokeWidth={2}
          strokeColor="red"
        />
      )}
    </MapView>
  );
};

export default Map;