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
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function TripTabNav() {

  return (
    <Tab.Navigator initialRouteName='TimeLine'
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarLabelStyle:{ fontSize: 12, },
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'TimeLine') {
            iconName = 'timeline'
          } else if (route.name === 'Calendar') {
            iconName =  'calendar-blank' 
          } else if (route.name === 'Expenses'){
            iconName =  'account-cash' 
          } else if (route.name === 'Invite'){
            iconName =  'account-plus'
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
      <Tab.Screen name="TimeLine" component={TimelineStack} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Expenses" component={ExpenseTable} />
      <Tab.Screen name="Invite" component={Invite} />
    </Tab.Navigator>
  )
  
};
