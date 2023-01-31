import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "../styles/globalStyles";

const { primary, blue } = colors;

import Trips from '../screens/Trips';
import UserPage from '../screens/UserPage';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function TripStack() {

  return (
    <Tab.Navigator initialRouteName='Trips'
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarLabelStyle:{ fontSize: 12, },
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Trips') {
            iconName = 'airplane'
          } else if (route.name === 'User Profile') {
            iconName =  "account" 
          }
          return (
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name={iconName} size={30} color={focused ? blue : '#9E9E9E'}/>
            </View>
          )
        },
        tabBarActiveTintColor:blue,
        // tabBarActiveBackgroundColor: blue,
        tabBarInactiveTintColor:'#9E9E9E',
        tabBarStyle:{ height:70 },
        tabBarItemStyle:{ paddingVertical:10, },
      })}
    >
      <Tab.Screen name="Trips" component={Trips} />
      <Tab.Screen name="User Profile" component={UserPage} />
    </Tab.Navigator>
  )
  
};
