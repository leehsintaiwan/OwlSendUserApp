import { useEffect, useRef } from "react";
import { Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Colors from "../core/Colors";

const Map = ({ orig, dest, currentLocation, orderStatus }) => {
  const mapRef = useRef(null);

  const getDriverVehicleImage = () => {
    switch (orderStatus.driver.vehicle) {
      case 0:
        return (
          <Image
            source={require("../assets/bicycle.png")}
            style={{ height: 40, width: 40 }}
          />
        );

      case 1:
        return (
          <Image
            source={require("../assets/scooter.png")}
            style={{ height: 40, width: 40 }}
          />
        );

      case 2:
        return (
          <Image
            source={require("../assets/van.png")}
            style={{ height: 40, width: 40 }}
          />
        );
    }
  };

  useEffect(() => {
    if (
      orderStatus?.status === "Picking Up" &&
      orderStatus?.driver.location &&
      orig
    ) {
      mapRef.current.fitToSuppliedMarkers(["driver", "orig"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    } else if (
      orderStatus?.status === "Delivering" &&
      orderStatus?.driver.location &&
      dest
    ) {
      mapRef.current.fitToSuppliedMarkers(["driver", "dest"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    } else if (orig && dest) {
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
        >
          <Image
            source={require("../assets/location.png")}
            style={{ height: 30, width: 30 }}
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
            style={{ height: 30, width: 30 }}
          />
        </Marker>
      )}
      {orderStatus?.driver.location && orderStatus?.status != "Delivered" && (
        <Marker
          coordinate={{
            latitude: orderStatus.driver.location.latitude,
            longitude: orderStatus.driver.location.longitude,
          }}
          identifier="driver"
        >
          {getDriverVehicleImage()}
        </Marker>
      )}
      {orig &&
        dest &&
        (!orderStatus?.driver.location ||
          orderStatus?.status === "Delivered") && (
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
      {orig &&
        dest &&
        orderStatus?.status === "Picking Up" &&
        orderStatus?.driver.location && (
          <MapViewDirections
            origin={{
              latitude: orderStatus.driver.location.latitude,
              longitude: orderStatus.driver.location.longitude,
            }}
            destination={{
              latitude: orig.location.latitude,
              longitude: orig.location.longitude,
            }}
            apikey="AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"
            strokeWidth={3}
            strokeColor={Colors.dark}
          />
        )}
      {orig &&
        dest &&
        orderStatus?.status === "Delivering" &&
        orderStatus?.driver.location && (
          <MapViewDirections
            origin={{
              latitude: orderStatus.driver.location.latitude,
              longitude: orderStatus.driver.location.longitude,
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
