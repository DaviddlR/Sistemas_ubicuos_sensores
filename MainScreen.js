import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

import { FlatList } from "react-native-gesture-handler";


// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { collection, addDoc } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBWW_awt0sX4Dg1L-bO2xOsjLUs8E-sJoY",

  authDomain: "ejemplofirebase3-20623.firebaseapp.com",

  projectId: "ejemplofirebase3-20623",

  storageBucket: "ejemplofirebase3-20623.appspot.com",

  messagingSenderId: "272552291751",

  appId: "1:272552291751:web:87b39cc7c95d5281035a82"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);




export default function App() {

  // Datos para la listView (nombres de los sensores)
  const dataSource = [
    { id: 1, title: 'Acelerómetro' },
    { id: 2, title: 'A' },
    { id: 999}
    
  ];

  // Elementos de la listview
  // Función que representa el item de la lista
  const Item = ({ id, title }) => (

    <TouchableOpacity style={styles.item}>
        <Text style={styles.title}>
            {title}
        </Text>
    </TouchableOpacity>
  );

  // Función para renderizar el item
  const renderItem = ({ item }) => (
      <Item id={item.id} title={item.title} />
  );

  // Separador establecido
  const separatorItem = () => {
      return (
          <View style={styles.separator} />
      )
  }







  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _registrar = async () => {
    console.log("REGISTRAMOS")
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada222",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

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

      <FlatList 
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={separatorItem}
      />


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

        <TouchableOpacity onPress={_registrar} >
          <Text>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: 'light-gray',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },

  separator:{
      //width: 300,
      height: 2,
      backgroundColor: '#d1d1d1'
  }
});
