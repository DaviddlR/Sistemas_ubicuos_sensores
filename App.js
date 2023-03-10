import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TRACKING = 'location-tracking';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log('tracking started?', hasStarted);
  };



  useEffect(() => {
    (async () => {

    console.log("Pide permisos")
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

    console.log("hace cosas")
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Button title="Start tracking" onPress={startLocationTracking} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      let lat = locations[0].coords.latitude;
      let long = locations[0].coords.longitude;
  
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
      );
    }
  });







