import React, { useEffect, useState, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, TimeLinAddBtn } from "../styles/globalStyles";

const { primary, blue } = colors;

import Calendar from '../screens/Calendar';
import Invite from '../screens/Invite';
import TimelineStack from './TimelineStack';
import { ExpenseTable } from '../screens/Expenses';
import { View } from 'react-native';
import { EventContext } from '../context/EventContext';
import { TripContext } from '../context/TripContext';

const Tab = createBottomTabNavigator();

export default function TripTabNav() {
  const { setModalOpen } = useContext(EventContext)
  const { permission } = useContext(TripContext)

  const state = useNavigationState(state => state);

  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    let tabIndex = state.routes[1].state ? state.routes[1].state.index : 0;
    if (tabIndex === 0) {
      setShowBtn(true);
    } else {
      setShowBtn(false);
    }
  }, [state.routes[1].state])

  return (
    <Tab.Navigator initialRouteName='TimeLine'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, },
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'TimeLine') {
            iconName = 'timeline'
          } else if (route.name === 'Calendar') {
            iconName = 'calendar-blank'
          } else if (route.name === 'Expenses') {
            iconName = 'account-cash'
          } else if (route.name === 'Invite') {
            iconName = 'account-plus'
          }
          return (
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name={iconName} size={30} color={focused ? blue : '#9E9E9E'} />
            </View>
          )
        },
        tabBarActiveTintColor: blue,
        // tabBarActiveBackgroundColor: blue,
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: { height: 70 },
        tabBarItemStyle: { paddingVertical: 10, },
      })}
    >
      <Tab.Screen name="TimeLine" component={TimelineStack} />
      <Tab.Screen name="Calendar" component={Calendar} />
      {showBtn ?
        permission ?
          null
          :
          <Tab.Screen name="Add Event" component={TimelineStack}
            options={{
              tabBarButton: () => <TimeLinAddBtn setModalOpen={setModalOpen} />
            }}
          />
        : null
      }
      <Tab.Screen name="Expenses" component={ExpenseTable} />
      <Tab.Screen name="Invite" component={Invite} />
    </Tab.Navigator>
  )

};
