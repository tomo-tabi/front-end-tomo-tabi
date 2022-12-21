import React, { useState } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';

export default function Trips({ navigation }) {
  const [tripData, setTripData] = useState([
    {tripName: 'Tokyo', id:1},
    {tripName: 'Osaka', id:2},
    {tripName: 'Boston', id:3}
  ]);

  //for Tokyo
  const [tripDetail, setTripDetail] = useState([
    {eventDate: '2022-12-04', eventName: 'Sky Tree', id:1},
    {eventDate: '2022-12-05', eventName: 'Tokyo Tower', id:2},
    {eventDate: '2022-12-06', eventName: 'Kura Sushi', id:3}
  ]);

  const pressHandler = (tripId) => {
    navigation.navigate('TimeLine', {id: tripId})
  }
  return (
    <>
    <View style={styles.container}>
      <FlatList
        keyExtractor={( item ) => item.id}
        data = {tripData}
        renderItem = {({ item }) => (
          <TouchableOpacity onPress={() => pressHandler(item.id)}>
            <Text style={styles.date}>{item.tripName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    </>
  )
};

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
  }
})