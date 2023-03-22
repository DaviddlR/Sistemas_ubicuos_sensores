import React, { useState } from 'react';
import { Component } from "react"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
 } from 'react-native';

import MainScreen from './MainScreen.js'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import 'react-native-gesture-handler';



const Stack = createStackNavigator();


 export default class App extends Component {


    render() {
     return (

      <NavigationContainer>
        <Stack.Navigator initialRouteName='MainScreen'
        
        screenOptions={{
          title: "Main",
          headerTitleAlign: 'center',
          
          headerStyle: {
            backgroundColor: '#003060',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          // NO FUNCIONA -> status bar
          
        }}
        
        >

            <Stack.Screen
                name="MainScreen"
                component={MainScreen}
                options={{
                  headerTitle:"Sensores disponibles",
                }}
              />

              

        </Stack.Navigator>

      </NavigationContainer>

     );


    }
  }