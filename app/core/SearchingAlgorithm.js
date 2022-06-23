import * as Location from "expo-location";
import {
  collection,
  doc,
  GeoPoint,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./Config";

// Variables for requesting drivers
let unsubscribes = [];
let requestedDriversAll = [];
let acceptedDriverFull = null;

let requestedDriversHandoff1 = [];
let acceptedDriverHandoff1 = null;

let requestedDriversHandoff2 = [];
let acceptedDriverHandoff2 = null;

export const findDrivers = async (
  orig,
  dest,
  userProfile,
  recipientName,
  recipientTel,
  length,
  width,
  height,
  weight,
  price,
  distance,
  minutes
) => {
  const midPoint = {
    latitude: (orig.location.latitude + dest.location.latitude) / 2,
    longitude: (orig.location.longitude + dest.location.longitude) / 2,
  };

  const handoffPoint = await findHandoffPoint(midPoint);
  const handoff = await geoToAddress(handoffPoint);
  const { dist: handoffDistance1, mins: handoffMinutes1 } = await getDistance(
    orig.location,
    handoffPoint
  );
  const { dist: handoffDistance2, mins: handoffMinutes2 } = await getDistance(
    handoffPoint,
    dest.location
  );

  const driverOrderFull = {
    userPhone: userProfile.phone,
    status: "pending",
    price: price,
    distance: distance,
    minutes: minutes,
    pickup: {
      type: "Pickup",
      name: userProfile.firstName + " " + userProfile.lastName,
      phone: userProfile.phone,
      address: orig.address,
      shortAddress: orig.shortAddress,
      postcode: orig.postcode,
      location: new GeoPoint(orig.location.latitude, orig.location.longitude),
    },
    dropoff: {
      type: "Deliver",
      name: recipientName,
      phone: recipientTel,
      address: dest.address,
      shortAddress: dest.shortAddress,
      postcode: dest.postcode,
      location: new GeoPoint(dest.location.latitude, dest.location.longitude),
    },
    dimensions: {
      length,
      width,
      height,
      weight,
    },
  };

  const driverOrderHandoff1 = {
    userPhone: userProfile.phone,
    status: "pending",
    price: price * (handoffDistance1 / (handoffDistance1 + handoffDistance2)),
    distance: handoffDistance1,
    minutes: handoffMinutes1,
    pickup: {
      type: "Pickup",
      name: userProfile.firstName + " " + userProfile.lastName,
      phone: userProfile.phone,
      address: orig.address,
      shortAddress: orig.shortAddress,
      postcode: orig.postcode,
      location: new GeoPoint(orig.location.latitude, orig.location.longitude),
    },
    dropoff: {
      type: "Handoff",
      address: handoff.address,
      shortAddress: handoff.shortAddress,
      postcode: handoff.postcode,
      location: new GeoPoint(
        handoff.location.latitude,
        handoff.location.longitude
      ),
    },
    dimensions: {
      length,
      width,
      height,
      weight,
    },
  };

  const driverOrderHandoff2 = {
    userPhone: userProfile.phone,
    status: "pending",
    price: price * (handoffDistance2 / (handoffDistance1 + handoffDistance2)),
    distance: handoffDistance2,
    minutes: handoffMinutes2,
    pickup: {
      type: "Handoff",
      address: handoff.address,
      shortAddress: handoff.shortAddress,
      postcode: handoff.postcode,
      location: new GeoPoint(
        handoff.location.latitude,
        handoff.location.longitude
      ),
    },
    dropoff: {
      type: "Deliver",
      name: recipientName,
      phone: recipientTel,
      address: dest.address,
      shortAddress: dest.shortAddress,
      postcode: dest.postcode,
      location: new GeoPoint(dest.location.latitude, dest.location.longitude),
    },
    dimensions: {
      length,
      width,
      height,
      weight,
    },
  };

  const q = query(
    collection(db, "RegisteredDrivers"),
    where("online", "==", true),
    where("available", "==", true)
  );

  unsubscribes.push(
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const driverPhone = change.doc.id;
        const requestedIdsFull = requestedDriversAll.map((driver) => driver.id);
        const requestedIdsHandoff1 = requestedDriversHandoff1.map(
          (driver) => driver.id
        );
        const requestedIdsHandoff2 = requestedDriversHandoff2.map(
          (driver) => driver.id
        );
        const newDriverOrder = doc(db, "DriverOrders", driverPhone);
        if (change.type === "added") {
          if (!requestedIdsFull.includes(driverPhone)) {
            console.log("Sending Full Request to Driver: ", driverPhone);
            await setDoc(newDriverOrder, driverOrderFull);
            requestedDriversAll.push(newDriverOrder);
          } else if (!requestedIdsHandoff1.includes(driverPhone)) {
            console.log("Sending Handoff1 Request to Driver: ", driverPhone);
            await setDoc(newDriverOrder, driverOrderHandoff1);
            requestedDriversHandoff1.push(newDriverOrder);
          } else if (!requestedIdsHandoff2.includes(driverPhone)) {
            console.log("Sending Handoff2 Request to Driver: ", driverPhone);
            await setDoc(newDriverOrder, driverOrderHandoff2);
            requestedDriversHandoff2.push(newDriverOrder);
          }
        }
      });
    })
  );
};

const acceptFull = async (orig, dest, userProfile) => {
  // Update driver order status to pickup
  const driverOrderDoc = doc(db, "DriverOrders", acceptedDriverFull.phone);
  await updateDoc(driverOrderDoc, {
    status: "pickup",
    "dropoff.code": "01234", // Temprorarily set to this, find a way to send text to recipient later
  });

  // Create new user order for user to display
  const newUserOrder = doc(db, "UserOrders", userProfile.phone);
  const userOrder = {
    status: "Picking Up",
    pickupTime: acceptedDriverFull.pickup.arriveBy,
    dropoffTime: acceptedDriverFull.dropoff.arriveBy,
    pickup: {
      shortAddress: orig.shortAddress,
      location: new GeoPoint(orig.location.latitude, orig.location.longitude),
    },
    dropoff: {
      shortAddress: dest.shortAddress,
      location: new GeoPoint(dest.location.latitude, dest.location.longitude),
    },
    driver: {
      name: acceptedDriverFull.name,
      phone: acceptedDriverFull.phone,
      vehicle: acceptedDriverFull.vehicle,
      location: acceptedDriverFull.location,
    },
  };
  await setDoc(newUserOrder, userOrder);
};

const acceptHandoff = async (orig, dest, userProfile) => {
  const handoffTime =
    acceptedDriverHandoff1.dropoff.arriveBy >
    acceptedDriverHandoff2.pickup.arriveBy
      ? acceptedDriverHandoff1.dropoff.arriveBy
      : acceptedDriverHandoff2.pickup.arriveBy;

  const handoffCode = String(Math.floor(Math.random() * 100000)).padStart(
    5,
    "0"
  );

  // Update driver order status to pickup and update handoff info
  const handoff1DriverOrderDoc = doc(
    db,
    "DriverOrders",
    acceptedDriverHandoff1.phone
  );
  await updateDoc(handoff1DriverOrderDoc, {
    status: "pickup",
    "dropoff.name": acceptedDriverHandoff2.name,
    "dropoff.phone": acceptedDriverHandoff2.phone,
    "dropoff.arriveBy": handoffTime,
    "dropoff.code": handoffCode,
  });

  // Update other driver order status to pickup and update handoff info
  const handoff2DriverOrderDoc = doc(
    db,
    "DriverOrders",
    acceptedDriverHandoff2.phone
  );
  await updateDoc(handoff2DriverOrderDoc, {
    status: "pickup",
    "pickup.name": acceptedDriverHandoff1.name,
    "pickup.phone": acceptedDriverHandoff1.phone,
    "pickup.arriveBy": handoffTime,
    "pickup.code": handoffCode,
    "dropoff.code": "01234", // Temprorarily set to this, find a way to send text to recipient later
  });

  // Create new user order for user to display
  const newUserOrder = doc(db, "UserOrders", userProfile.phone);
  const userOrder = {
    status: "Picking Up",
    pickupTime: acceptedDriverHandoff1.pickup.arriveBy,
    handoffTime: handoffTime,
    dropoffTime: acceptedDriverHandoff2.dropoff.arriveBy,
    handoffed: false,
    pickup: {
      shortAddress: orig.shortAddress,
      location: new GeoPoint(orig.location.latitude, orig.location.longitude),
    },
    handoff: {
      shortAddress: acceptedDriverHandoff1.dropoff.shortAddress,
      location: acceptedDriverHandoff1.dropoff.location,
    },
    dropoff: {
      shortAddress: dest.shortAddress,
      location: new GeoPoint(dest.location.latitude, dest.location.longitude),
    },
    driver: {
      name: acceptedDriverHandoff1.name,
      phone: acceptedDriverHandoff1.phone,
      vehicle: acceptedDriverHandoff1.vehicle,
      location: acceptedDriverHandoff1.location,
    },
  };
  await setDoc(newUserOrder, userOrder);
};

export const waitForDrivers = (userProfile, orig, dest, timer, navigation) => {
  const q = query(
    collection(db, "DriverOrders"),
    where("status", "==", "accepted"),
    where("userPhone", "==", userProfile.phone)
  );

  unsubscribes.push(
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (
          change.type === "added" &&
          !acceptedDriverFull &&
          !(acceptedDriverHandoff1 && acceptedDriverHandoff2)
        ) {
          const driverPhone = change.doc.id;
          const driverOrder = change.doc.data();

          if (
            driverOrder.pickup.type === "Pickup" &&
            driverOrder.dropoff.type === "Deliver"
          ) {
            console.log(
              "Full Journey Accepted by Driver: ",
              driverPhone,
              driverOrder.name
            );
            acceptedDriverFull = { ...driverOrder, phone: driverPhone };

            // Cleanup all drivers
            clearTimeout(timer);
            await acceptFull(orig, dest, userProfile);
            cleanupAllDrivers(userProfile);
            navigation.navigate("Home", { screen: "Status" });
          } else if (
            driverOrder.pickup.type === "Pickup" &&
            driverOrder.dropoff.type === "Handoff"
          ) {
            console.log(
              "Handoff1 Accepted by Driver: ",
              driverPhone,
              driverOrder.name
            );
            acceptedDriverHandoff1 = { ...driverOrder, phone: driverPhone };

            // Cleanup handoff1 drivers
            if (acceptedDriverHandoff2) {
              clearTimeout(timer);
              await acceptHandoff(orig, dest, userProfile);
              cleanupAllDrivers(userProfile);
              navigation.navigate("Home", { screen: "Status" });
            } else {
              cleanupHandoff1Drivers(userProfile);
            }
          } else if (
            driverOrder.pickup.type === "Handoff" &&
            driverOrder.dropoff.type === "Deliver"
          ) {
            console.log(
              "Handoff2 Accepted by Driver: ",
              driverPhone,
              driverOrder.name
            );
            acceptedDriverHandoff2 = { ...driverOrder, phone: driverPhone };

            // Cleanup handoff2 drivers
            if (acceptedDriverHandoff1) {
              clearTimeout(timer);
              await acceptHandoff(orig, dest, userProfile);
              cleanupAllDrivers(userProfile);
              navigation.navigate("Home", { screen: "Status" });
            } else {
              cleanupHandoff2Drivers(userProfile);
            }
          }
        }
      });
    })
  );
};

export const cleanupAllDrivers = (userProfile) => {
  requestedDriversAll.forEach(async (driverRef) => {
    if (
      driverRef.id != acceptedDriverFull?.phone &&
      driverRef.id != acceptedDriverHandoff1?.phone &&
      driverRef.id != acceptedDriverHandoff2?.phone
    ) {
      console.log("Cancelling Driver Request: ", driverRef.id);
      try {
        await runTransaction(db, async (transaction) => {
          const driverDoc = await transaction.get(driverRef);
          if (
            driverDoc.exists() &&
            driverDoc.data().userPhone === userProfile.phone // Ensure it hasn't been overwritten by another user request
          ) {
            transaction.delete(driverRef);
          }
        });
      } catch (e) {
        console.log(
          "Cancelling all other driver requests. Transaction failed: ",
          e
        );
      }
    }
  });
  console.log("Successfully cancelled all other driver requests");

  unsubscribes.forEach((unsub) => {
    unsub();
  });

  unsubscribes = [];
  requestedDriversAll = [];
  requestedDriversHandoff1 = [];
  requestedDriversHandoff2 = [];
  acceptedDriverFull = null;
  acceptedDriverHandoff1 = null;
  acceptedDriverHandoff2 = null;
};

const cleanupHandoff1Drivers = (userProfile) => {
  const requestedIdsHandoff2 = requestedDriversHandoff2.map(
    (driver) => driver.id
  );

  requestedDriversHandoff1.forEach(async (driverRef) => {
    if (
      driverRef.id != acceptedDriverHandoff1.phone &&
      !requestedIdsHandoff2.includes(driverRef.id)
    ) {
      console.log("Cancelling Handoff1 Driver Request: ", driverRef.id);
      try {
        await runTransaction(db, async (transaction) => {
          const driverDoc = await transaction.get(driverRef);
          if (
            driverDoc.exists() &&
            driverDoc.data().userPhone === userProfile.phone // Ensure it hasn't been overwritten by another user request
          ) {
            transaction.delete(driverRef);
          }
        });
      } catch (e) {
        console.log(
          "Cancelling handoff1 driver requests. Transaction failed: ",
          e
        );
      }
    }
  });
  console.log("Successfully cancelled all handoff1 driver requests");
};

const cleanupHandoff2Drivers = (userProfile) => {
  requestedDriversHandoff2.forEach(async (driverRef) => {
    if (driverRef.id != acceptedDriverHandoff2.phone) {
      console.log("Cancelling Handoff2 Driver Request: ", driverRef.id);
      try {
        await runTransaction(db, async (transaction) => {
          const driverDoc = await transaction.get(driverRef);
          if (
            driverDoc.exists() &&
            driverDoc.data().userPhone === userProfile.phone // Ensure it hasn't been overwritten by another user request
          ) {
            transaction.delete(driverRef);
          }
        });
      } catch (e) {
        console.log(
          "Cancelling handoff2 driver requests. Transaction failed: ",
          e
        );
      }
    }
  });
  console.log("Successfully cancelled all handoff2 driver requests");
};

// Helper function to calculate distance and minutes between to geolocation points.
export const getDistance = async (orig, dest) => {
  let dist = 0;
  let mins = 0;

  if (orig && dest) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${
      orig.latitude
    },${orig.longitude}&destinations=${dest.latitude},${
      dest.longitude
    }&units=imperial&key=${"AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"}`;

    const res = await fetch(url);

    const data = await res.json();

    dist = data.rows[0].elements[0].distance
      ? parseFloat(
          data.rows[0].elements[0].distance.text.replace(",", "").split(" ")[0]
        )
      : -1;

    mins =
      dist >= 0 ? Math.round(data.rows[0].elements[0].duration.value / 60) : -1;
  }

  return { dist, mins };
};

const findHandoffPoint = async (midPoint) => {
  var axios = require("axios");

  var config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${midPoint.latitude}%2C${midPoint.longitude}&rankby=distance&type=gas_station&key=AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY`,
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      const { lat: latitude, lng: longitude } =
        response.data["results"][0]["geometry"]["location"];

      return {
        latitude,
        longitude,
      };
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const geoToAddress = async (location) => {
  const { latitude, longitude } = location;
  let response = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  let address = `${response[0].name}, ${response[0].street}, ${response[0].city}, ${response[0].postalCode}`;

  return {
    location: {
      latitude,
      longitude,
    },
    address: address,
    shortAddress: response[0].name,
    postcode: response[0].postalCode,
  };
};
