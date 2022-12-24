// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

//context and Navigation
import { AuthProvider } from './context/AuthContext';
import AppNav from './routes/AppNav';

export default function App() {

  return (
    <AuthProvider> {/* passes global variables down */}
      <View style={styles.container}>
        <AppNav/>
      </View>
    </AuthProvider>
  );
}
/* <NavigationContainer>
<Stack.Navigator initialRouteName='Login'>
 <Stack.Screen name='Login' component={Login}/>
 <Stack.Screen name='Signup' component={Signup}/>
 <Stack.Screen name='Welcome' component={Welcome}/>
 <Stack.Screen name='Trips' component={Trips} />
 <Stack.Screen name='TripTabNav' component={TripTabNav} 
   options= {({route}) => ({
     headerTitle: getHeaderTitle(route)
   })}
 />
</Stack.Navigator>
</NavigationContainer>  */
// <View style={styles.container}>
//   {loginState ? 
//    <NavigationContainer>
//     <Stack.Navigator initialRouteName='Trips'>
//       <Stack.Screen name='Trips' component={Trips} />
//       <Stack.Screen name='Trips' component={Trips} />
//       <Stack.Screen name='TripTabNav' component={TripTabNav}/>
//     </Stack.Navigator>
//    </NavigationContainer> 
//   : //<Login loginState = {loginState} 
//     <SignupLoginNav
//   /> 
//   }
//   <Signup />
// </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

