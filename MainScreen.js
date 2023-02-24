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

function activarSensor(id){
  console.log(id)

  
}


export default function App() {

  // Datos para la listView (nombres de los sensores)
  const dataSource = [
    { id: 1, title: 'Acelerómetro' },
    { id: 2, title: 'Barómetro' },
    { id: 3, title: 'Giroscopio' },
    // { id: 4, title: 'Luminosidad' },
    // { id: 5, title: 'Magnetómetro' },
    // { id: 6, title: 'Podómetro' },
    // { id: 7, title: 'GPS' },
    { id: 999}
    
  ];
  

  // Elementos de la listview
  // Función que representa el item de la lista
  const Item = ({ id, title }) => (

    <View style={styles.item}>

      <Text style={styles.title}>
          {title}
      </Text>

      <TouchableOpacity style={estilarBoton(id, 0)} onPress={() => {
        console.log("----", sensores[id])
        if(sensores[id] == false){
          
          setSensores(previousState => {
            return { ...previousState, [id]:true}
          })
          console.log('abrimos')
          suscripcionsetAcelerometro(
            Accelerometer.addListener(setData),
            Accelerometer.setUpdateInterval(400)
          );
        } else {
          setSensores(previousState => {
            return { ...previousState, [id]:false}
          })
          console.log('cerramos')
          suscripcionacelerometro && suscripcionacelerometro.remove();
          setSubscription(null);
        }
      }
        
        
      }>


        <Text style={styles.textoBotonActivar}>{estilarBoton(id, 1)}</Text>
      </TouchableOpacity>

    </View>
    
  );

  function estilarBoton(id,tarea){
    if(sensores[id] == true){
      if (tarea == 1){
        return "Desactivar"
      } else {
        return styles.botonDesactivarSensor
      }
    } else {
      if (tarea == 1){
        return "Activar"
      } else {
        return styles.botonActivarSensor
      }
    }
  }
  

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

  


  const [sensores, setSensores] = useState(
    {
      1:false,
      2:false,
      3:false,
      4:false,
      5:false,
      6:false,
      7:false,
    }
  )

  const [suscripciones, setSuscripciones] = useState(
    {
      1:null,
      2:null,
      3:null,
      4:null,
      5:null,
      6:null,
      7:null,
    }
  )

  const [acelerometro, setAcelerometro] = useState(false)
  const [barometro, setBarometro] = useState(false)
  const [giroscopio, setGiroscopio] = useState(false)
  const [magnetometro, setMagnetometro] = useState(false)
  const [luminosidad, setLuminosidad] = useState(false)
  const [podometro, setPodometro] = useState(false)
  const [gps, setGPS] = useState(false)

  const [suscripcionacelerometro, suscripcionsetAcelerometro] = useState(null)
  const [suscripcionbarometro, suscripcionsetBarometro] = useState(null)
  const [suscripciongiroscopio, suscripcionsetGiroscopio] = useState(null)
  const [suscripcionmagnetometro, suscripcionsetMagnetometro] = useState(null)
  const [suscripcionluminosidad, suscripcionsetLuminosidad] = useState(null)
  const [suscripcionpodometro, suscripcionsetPodometro] = useState(null)
  const [suscripciongps, suscripcionsetGPS] = useState(null)

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });


  const [subscription, setSubscription] = useState(null);

  

  const _subscribe = (id) => {
    setSubscription(
      Accelerometer.addListener(setData),
      Accelerometer.setUpdateInterval(400)
    );
  };

  const _unsubscribe = (id) => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // useEffect(() => {
  //   _subscribe();
  //   return () => _unsubscribe();
  // }, []);




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
    backgroundColor: 'white',
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
  },
  botonActivarSensor: {
    position: 'absolute',
    backgroundColor: 'green',
    right: '5%',
    top: '60%',
    width: 90,
    
  },

  botonDesactivarSensor: {
    position: 'absolute',
    backgroundColor: 'red',
    right: '5%',
    top: '60%',
    width: 90,
    
  },

  textoBotonActivar: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center'
  },
});
