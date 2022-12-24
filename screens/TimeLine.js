import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { InfoContext } from '../context/InfoContext';

export default function TimeLine ({ route, navigation }) {
  const { id } = route.params;
  const { tripDb, tripDetails, setTripDetails } = useContext(InfoContext)
  //fetch trip detail with id 

  useEffect(() => {
    setTripDetails(tripDb[id]);
  }, [id])

  // console.log(id)
  

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
          data={tripDetails}
          renderItem={renderItem}
          />
      </View>
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