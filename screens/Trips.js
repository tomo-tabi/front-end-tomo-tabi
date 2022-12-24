import React, { useState } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';

export default function Trips({ navigation }) {
  const [tripData, setTripData] = useState([
    {tripName: 'Tokyo', id:1},
    {tripName: 'Osaka', id:2},
    {tripName: 'Boston', id:3}
  ]);

  const pressHandler = (tripId) => {
    // navigation.navigate('Timeline', {id: tripId})
    // navigation.navigate('TabNav', {id: tripId})
    navigation.navigate('TabNav', {
      screen: 'TimeLine',
      params: {id: tripId}
    })
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