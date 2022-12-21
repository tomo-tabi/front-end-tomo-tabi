import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendar from './Calendar';
// import idk from './idk';

const Tab = createBottomTabNavigator();

export default function TimeLine ({ route, navigation }) {
  const { id } = route.params;
  //fetch trip detail with id 
  const dataBase = {
    1: [
      {eventDate: '2022-12-04', eventName: 'Sky Tree', id:1},
      {eventDate: '2022-12-05', eventName: 'Tokyo Tower', id:2},
      {eventDate: '2022-12-06', eventName: 'Kura Sushi', id:3}
    ],
    2:[
      {eventDate: '2022-12-04', eventName: 'Universal Studios Japan', id:1},
      {eventDate: '2022-12-05', eventName: 'Osaka Castle (Osakajo)', id:2},
      {eventDate: '2022-12-06', eventName: 'Osaka Okonomiyaki', id:3}
    ],
    3:[
      {eventDate: '2022-12-04', eventName: 'Museum of Fine Arts', id:1},
      {eventDate: '2022-12-05', eventName: 'Fenway Parks', id:2},
      {eventDate: '2022-12-06', eventName: 'Freedom Trail', id:3}
    ]
  }

  const [data, setData] = useState(null);
  
  useEffect(() => {
    setData(dataBase[id]);
  }, [])
  

  const renderItem = ({ item }) => {
    const date = new Date(item.eventDate).toDateString();
    return (
      <>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.dayEvent}>{item.eventName}</Text>
      </>
    )
  }

  return (
    <>
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={renderItem}
          />
      </View>
      {/* maybe this is not the place to place tab nav??? */}
        <Tab.Navigator initialRouteName='Calendar'
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: 'blue',
          })}
        >
          <Tab.Screen name="Calendar" component={Calendar} />
          {/* <Tab.Screen name="idk" component={idk} /> */}
        </Tab.Navigator>
    </>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },

  date:{
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 6,
    backgroundColor:'#A020F0'
  },

  dayEvent:{
    fontSize: 24,
    padding: 20
  }
})