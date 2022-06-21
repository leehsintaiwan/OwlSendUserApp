import {
  collection,
  doc,
  GeoPoint,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./Config";

// Variables for requesting drivers
let unsubscribes = [];
let requestedDrivers = [];
let acceptedDriver = null;

export const findDrivers = (
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
  distance
) => {
  const dimensions = [length, width, height];
  dimensions.sort((a, b) => a - b).reverse();

  const q = query(
    collection(db, "RegisteredDrivers"),
    where("online", "==", true),
    where("available", "==", true)
  );

  unsubscribes.push(
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const driverPhone = change.doc.id;
        const requestedIds = requestedDrivers.map((driver) => driver.id);
        driverLength = change.doc.data().dimensions.length;
        driverWidth = change.doc.data().dimensions.width;
        driverHeight = change.doc.data().dimensions.height;
        driverWeight = change.doc.data().dimensions.weight;
        if (
          change.type === "added" &&
          !requestedIds.includes(driverPhone) &&
          (isNaN(driverLength) || driverLength >= dimensions[0]) &&
          (isNaN(driverWidth) || driverWidth >= dimensions[1]) &&
          (isNaN(driverHeight) || driverHeight >= dimensions[2]) &&
          (isNaN(driverWeight) || driverWeight >= weight)
        ) {
          console.log("Sending Request to Driver: ", driverPhone);

          const newDoc = doc(db, "DriverOrders", driverPhone);

          const docData = {
            userPhone: userProfile.phone,
            status: "pending",
            price: price,
            distance: distance,
            minutes: 10,
            pickup: {
              type: "Pickup",
              name: userProfile.firstName + " " + userProfile.lastName,
              phone: userProfile.phone,
              address: orig.address,
              shortAddress: orig.shortAddress,
              postcode: orig.postcode,
              location: new GeoPoint(
                orig.location.latitude,
                orig.location.longitude
              ),
              // arriveBy:
            },
            dropoff: {
              type: "Deliver",
              name: recipientName,
              phone: recipientTel,
              address: dest.address,
              shortAddress: dest.shortAddress,
              postcode: dest.postcode,
              location: new GeoPoint(
                dest.location.latitude,
                dest.location.longitude
              ),
              // arriveBy:
            },
          };

          await setDoc(newDoc, docData);
          requestedDrivers.push(newDoc);
        }
      });
    })
  );
};

export const waitForDrivers = (userProfile, orig, dest, timer, navigation) => {
  const q = query(
    collection(db, "DriverOrders"),
    where("status", "==", "accepted")
  );

  unsubscribes.push(
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added" && !acceptedDriver) {
          const driverPhone = change.doc.id;

          // Update driver order status to pickup straight away for this week without chaining
          const driverOrderDoc = doc(db, "DriverOrders", driverPhone);
          await updateDoc(driverOrderDoc, { status: "pickup" });
          acceptedDriver = driverOrderDoc.id;

          // Get driver name from registered drivers
          const driverDoc = doc(db, "RegisteredDrivers", driverPhone);
          const driver = (await getDoc(driverDoc)).data();

          console.log("Accepted by Driver: ", driverPhone, driver.name);

          const newDoc = doc(db, "UserOrders", userProfile.phone);

          const docData = {
            status: "Picking Up",
            pickupTime: Timestamp.fromMillis(Date.now() + 10 * 60 * 1000), // pickup in 10 mins
            handoffTime: Timestamp.fromMillis(Date.now() + 10 * 60 * 1000), // pickup in 10 mins
            dropoffTime: Timestamp.fromMillis(Date.now() + 10 * 60 * 1000), // pickup in 10 mins
            pickup: {
              shortAddress: orig.shortAddress,
              location: new GeoPoint(
                orig.location.latitude,
                orig.location.longitude
              ),
            },
            dropoff: {
              shortAddress: dest.shortAddress,
              location: new GeoPoint(
                dest.location.latitude,
                dest.location.longitude
              ),
            },
            driver: {
              name: driver.name,
              phone: driverPhone,
              vehicle: driver.vehicle,
              location: driver.location,
            },
          };

          await setDoc(newDoc, docData);

          clearTimeout(timer);
          cleanupDrivers(userProfile);
          navigation.navigate("Home", { screen: "Status" });
        }
      });
    })
  );
};

export const cleanupDrivers = (userProfile) => {
  requestedDrivers.forEach(async (driverRef) => {
    if (driverRef.id != acceptedDriver) {
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
  requestedDrivers = [];
  acceptedDriver = null;
};
