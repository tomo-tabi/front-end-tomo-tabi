import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Ionicons from 'react-native-vector-icons/Ionicons';

import Calendar from '../screens/Calendar';
import TimeLine from '../screens/TimeLine';
import { ExpenseTable } from '../screens/Expenses';

const Tab = createBottomTabNavigator();

export default function TripTabNav() {

  return (
    <Tab.Navigator initialRouteName='TimeLine'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'TimeLine') {
            iconName = focused
              ? 'timeline'
              : 'timeline-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused 
            ? 'calendar-blank' 
            : 'calendar-blank-outline';
          } else if (route.name === 'Expenses'){
            iconName = focused 
            ? 'account-cash' 
            : 'account-cash-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={30} />
        },
        tabBarActiveTintColor:'#A020F0',
      })}
    >
      <Tab.Screen name="TimeLine" component={TimeLine} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Expenses" component={ExpenseTable} />
    </Tab.Navigator>
  )
  
};
