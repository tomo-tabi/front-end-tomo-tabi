import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react'
import { StyleSheet, Text, FlatList, View } from 'react-native'
import TimeLine from './screens/TimeLine'

//screens
import Login from './screens/Login';

export default function App() {

  return (
   
    <View style={styles.container}>
        <TimeLine />
        {/* <Login /> */}
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
