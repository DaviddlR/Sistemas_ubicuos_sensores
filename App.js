import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(setData)
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View>
      <Text>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      <View>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} >
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} >
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} >
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

