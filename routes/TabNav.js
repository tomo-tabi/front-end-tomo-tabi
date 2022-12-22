import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons, Ionicons } from '@expo/vector-icons';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import Calendar from '../screens/Calendar';
import TimeLine from '../screens/TimeLine';

const Tab = createBottomTabNavigator();

export default function TabNav({ navigation }) {

  return (
    <Tab.Navigator initialRouteName='TimeLine'
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
            // let iconName;

            // if (route.name === 'Home') {
            //   iconName = focused
            //     ? 'ios-information-circle'
            //     : 'ios-information-circle-outline';
            // } else if (route.name === 'Settings') {
            //   iconName = focused ? 'ios-list' : 'ios-list-outline';
            // }

            // You can return any component that you like here!
            return <Octicons name={'mail'} size={30} />
          },
      tabBarActiveTintColor: '#A020F0',
    })}
    >
      <Tab.Screen name="TimeLine" component={TimeLine} />
      <Tab.Screen name="Calendar" component={Calendar} />
    </Tab.Navigator>
  )
  
};
