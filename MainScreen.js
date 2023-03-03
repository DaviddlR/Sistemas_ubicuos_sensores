import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Barometer } from 'expo-sensors';

import { FlatList } from "react-native-gesture-handler";


// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 

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

        // Si el sensor con este id está desactivado...
        if(sensores[id] == false){
          
          // Marcamos como activado
          setSensores(previousState => {
            return { ...previousState, [id]:true}
          })

          // Activamos el sensor
          activarDesactivarSensor(id, 1)

        // Si está activado, lo desactivamos
        } else {

          // Marcamos como desactivado
          setSensores(previousState => {
            return { ...previousState, [id]:false}
          })
          
          // Desactivamos el sensor
          activarDesactivarSensor(id, 0)
        }
      }
        
        
      }>


        <Text style={styles.textoBotonActivar}>{estilarBoton(id, 1)}</Text>
      </TouchableOpacity>

    </View>
    
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

  // Función para estilar el color del botón y el texto según el sensor esté activo o no.
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

  // Función para activar o desactivar un sensor según el caso
  function activarDesactivarSensor(id, interruptor){

    // Si el interruptor está a 1, activamos el sensor
    if(interruptor == 1){

      // Localizamos el sensor
      if(id == 1){
        console.log("Activamos acelerómetro")
        suscripcionsetAcelerometro(
          Accelerometer.addListener(getDataAcelerometro),
          Accelerometer.setUpdateInterval(500)
        );
      }else if (id==2){
          console.log("Activamos barómetro")
          suscripcionsetBarometro(
            Barometer.addListener(getDataBarometro),
            Barometer.setUpdateInterval(30000)
          );
      }

    // Si el interruptor está a 0, desactivamos el sensor
    } else {

      // Localizamos el sensor
      if(id == 1){
        console.log("Desactivamos acelerómetro")

        suscripcionacelerometro && suscripcionacelerometro.remove();
        suscripcionsetAcelerometro(null);
      }else if (id==2){
           console.log("Desactivamos barometro")
           suscripcionbarometro && suscripcionbarometro.remove();
           suscripcionsetBarometro(null);
      }
    }

    
  }
  



  

  // EEDD que almacena el estado de los sensores
  // False = desactivado, True = activado
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

  // EEDD que almacena las suscripciones a los sensores disponibles
  const [suscripcionacelerometro, suscripcionsetAcelerometro] = useState(null)
  const [suscripcionbarometro, suscripcionsetBarometro] = useState(null)
  const [suscripciongiroscopio, suscripcionsetGiroscopio] = useState(null)
  const [suscripcionmagnetometro, suscripcionsetMagnetometro] = useState(null)
  const [suscripcionluminosidad, suscripcionsetLuminosidad] = useState(null)
  const [suscripcionpodometro, suscripcionsetPodometro] = useState(null)
  const [suscripciongps, suscripcionsetGPS] = useState(null)


  // Para mostrar datos por pantalla. Se puede borrar / adaptar a otro sensor para hacer pruebas
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });


  // Función que se queda a la escucha del acelerómetro
  const getDataAcelerometro = (data) => {
    // Recogemos los datos
    setData(data)

    // Los enviamos a la BBDD
    registrarAcelerometro(data['x'], data['y'], data['z'])
  }

  // Función para registrar los datos del acelerómetro
  const registrarAcelerometro = async(x, y, z) => {
    console.log("REGISTRAMOS acelerometro")

    var fechaActual = new Date()
    console.log(fechaActual)
    try {

      const docRef = await setDoc(doc(db, "Acelerometro", fechaActual.toString()), {
        x: x,
        y: y,
        z: z
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

//Barometro
// Para mostrar datos por pantalla. Se puede borrar / adaptar a otro sensor para hacer pruebas
  const [{ pressure, relativeAltitude }, setDataBarometro] = useState({ pressure: 0, relativeAltitude: 0 });


  // Función que se queda a la escucha del acelerómetro
  const getDataBarometro = (data) => {
    // Recogemos los datos
    setDataBarometro(data)

    console.log(data)

    // Los enviamos a la BBDD
    registrarBarometro(data['pressure'], data['relativeAltitude'])
  }

  // Función para registrar los datos del acelerómetro
  const registrarBarometro = async(pressure, relativeAltitude) => {
    console.log("REGISTRAMOS barometro")
    try {
      const docRef = await addDoc(collection(db, "Barometro"), {
        pressure: pressure,
        
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


  // const _registrar = async () => {
  //   console.log("REGISTRAMOS")
  //   try {
  //     const docRef = await addDoc(collection(db, "users"), {
  //       first: "Ada222",
  //       last: "Lovelace",
  //       born: 1815
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // }


  return (

    <View>

      <FlatList 
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={separatorItem}
      />

      <Text>Barometer: </Text>
            <Text>pressure: {pressure} hp</Text>
            <Text>relativeAltitude: {relativeAltitude}</Text>

      <Text>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
      <Text>x: {x}</Text>
      <Text>y: {y}</Text>
      <Text>z: {z}</Text>
      {/* <View>

        <TouchableOpacity onPress={_registrar} >
          <Text>Registrar</Text>
        </TouchableOpacity>
      </View> */}
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
