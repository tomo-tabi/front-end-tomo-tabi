import React from 'react';
import { StyleSheet, View } from 'react-native';

//context and Navigation
import { AuthProvider } from './context/AuthContext';
import AppNav from './routes/AppNav';

export default function App() {
  //AuthProvider -> passes global variables down

  return (
    <AuthProvider> 
      <View style={styles.container}>
        <AppNav/>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

