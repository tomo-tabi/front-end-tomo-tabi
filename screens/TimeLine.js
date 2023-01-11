import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, FlatList, View, Modal, TouchableOpacity, Button } from 'react-native';
import { InfoContext } from '../context/InfoContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AddTimeline from './AddTimeline';


export default function TimeLine ({ route, navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  // const [dateSortEvents, setDateSortEvents] = useState({}) 
  const { id } = route.params;
  const { tripEvents, getTripEvents } = useContext(InfoContext)
  //fetch one trip detail with trip id 

  useEffect(() => {
    // setTripEvents(tripEventDBData[id])
    getTripEvents(id);
  }, [id])

  // useEffect(() => {
  //   // console.log("🍏",tripEvents);
  //   if(tripEvents !== null){
  //   // item = {
  //   //   id: 1,
  //   //   event_name: 'Tokyo Tower',
  //   //   event_date: 2023-01-01T15:00:00.000Z,
  //   //   trip_id: 1
  //   // }

  //     tripEvents.map((item) => {
        
  //       if(dateSortEvents[item.event_date]){
  //         dateSortEvents[item.event_date] = (dateSortEvents[item.event_date].push({trip_id: item.trip_id, event_name: item.event_name, id:item.id}))
  //       } else {
  //         console.log("🍒");
  //         dateSortEvents[item.event_date] = [{trip_id: item.trip_id, event_name: item.event_name, id:item.id}]
  //       }
  //       console.log(dateSortEvents);
  //     })
      
  //     // return groupByDate
  //   }
    
  //   setDateSortEvents(dateSortEvents)
  // }, [tripEvents])
  

  const renderItem = ({ item }) => {
 
    const date = new Date(item.event_date).toDateString();
    return (
      <>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.dayEvent}>{item.event_name}</Text>
        {/* {Object.keys(dateSortEvents).length !== 0 ? dateSortEvents[item.event_date].map((eventName)=>(
          <Text style={styles.dayEvent}>{eventName}</Text>
          ))
          :""
          } */}
        
      </>
    )
  }
  

  return (
    <>
      <View style={styles.container}>
        
        <FlatList
          keyExtractor={(item) => item.id}
          data={tripEvents}
          renderItem={renderItem}
        />

        <Modal visible={modalOpen} animationType="slide">
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name='window-close'
              size={24}
              style={{...styles.modalToggle, ...styles.modalClose}}
              onPress={() => setModalOpen(false)}
            />
            <AddTimeline/>
          </View>
        </Modal>
        
        <TouchableOpacity onPress={() => setModalOpen(true)}>
          <MaterialCommunityIcons
            name='plus-circle'
            size={50}
            style={styles.modalToggle}
          />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },

  date:{
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor:'#A020F0'
  },

  dayEvent:{
    fontSize: 24,
    padding: 20
  },
  modalContent:{
    flex:1,
    margin:10,
  },
  modalToggle:{
    margin:10,
    alignSelf:"flex-end",
    color:'#A020F0'
  },
  modalClose:{
    margin:0,
    color:'black'
  }
})