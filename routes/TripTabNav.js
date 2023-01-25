import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "../styles/globalStyles";

const { primary, blue } = colors;

import Calendar from '../screens/Calendar';
import TimeLine from '../screens/TimeLine';
import Invite from '../screens/Invite';
import { ExpenseTable } from '../screens/Expenses';
import TimelineStack from './TimelineStack';

const Tab = createBottomTabNavigator();

export default function TripTabNav() {

  return (
    <Tab.Navigator initialRouteName='TimeLine'
      screenOptions={({ route }) => ({
        headerShown:false,
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
          } else if (route.name === 'Invite'){
            iconName = focused 
            ? 'account-plus'
            : 'account-plus-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={30} />
        },
        tabBarActiveTintColor:blue,
        
      })}
    >
      <Tab.Screen name="TimeLine" component={TimelineStack} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Expenses" component={ExpenseTable} />
      <Tab.Screen name="Invite" component={Invite} />
    </Tab.Navigator>
  )
  
};
