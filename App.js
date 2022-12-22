import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import Login from './screens/Login';
// import TimeLine from './screens/TimeLine'
import Trips from './screens/Trips'
import TabNav from './routes/TabNav';

const Stack = createNativeStackNavigator();

export default function App() {
  //assuming lonin is true
  const [loginState, setLoginState] = useState(true)

  return (
   
    <View style={styles.container}>
      {loginState ? 
       <NavigationContainer>
        <Stack.Navigator initialRouteName='Trips'>
          <Stack.Screen name='Trips' component={Trips} />
          <Stack.Screen name='TabNav' component={TabNav}/>
        </Stack.Navigator>
       </NavigationContainer> 
      : <Login loginState = {loginState} /> 
      }
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
