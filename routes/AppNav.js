import React, { useContext } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppStack from './AppStack';
import LoginStack from "./LoginStack";
import { AuthContext } from '../context/AuthContext';

export default function AppNav() {
  const {userToken, isLoading} = useContext(AuthContext);  

  if(isLoading){
    return(
      <View style={styles.container}>
        <ActivityIndicator size={'large'}/>
      </View>
    )
  }


  return (
    <NavigationContainer>
      {userToken !== null ? <AppStack/> : <LoginStack/> }
    </NavigationContainer>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
