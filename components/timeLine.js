import React, { useState } from 'react'
import { StyleSheet, Text, FlatList, View } from 'react-native'

export default function TimeLine () {
  const [data, setData] = useState([
    {eventDate: '2022-12-04', eventName: 'Sky Tree', id:1},
    {eventDate: '2022-12-05', eventName: 'Tokyo Tower', id:2},
    {eventDate: '2022-12-06', eventName: 'Kura Sushi', id:3}
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({item}) => (
          <>
            <Text style={styles.date}>{item.eventDate}</Text>
            <Text style={styles.dayEvent}>{item.eventName}</Text>
          </>
        )}
      />
    </View>
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
    backgroundColor:'#A020F0'
  },

  dayEvent:{
    fontSize: 24,
  }
})