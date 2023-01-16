import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, FlatList, View, Modal, TouchableOpacity, Button } from 'react-native';
import { InfoContext } from '../context/InfoContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

import AddTimeline from './AddTimeline';


export default function TimeLine ({ route, navigation }) {
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ dateSortEvents, setDateSortEvents ] = useState({}) 
  
  const { id } = route.params;
  const { tripEvents, getTripEvents } = useContext(InfoContext)
  //fetch one trip detail with trip id 

  useEffect(() => {
    setDateSortEvents({});// don't know if I need it, will look into later
    getTripEvents(id);
  }, [id])

  useEffect(() => {
    if(tripEvents !== null){
      // setDateSortEvents({});
    const Obj = {}
    tripEvents.map((item) => {
        let date = moment(item.event_date).format("dddd, MMM DD, YYYY");
        let time = moment(item.event_date).format("HH:mm A");

        if(item.trip_id !== id) {
          return
        }

        const dateObj = {
          trip_id: item.trip_id, 
          event_name: item.event_name, 
          time: time, 
          id:item.id
        }
        
        if(Obj[date]){
          let exists = Obj[date].find((eventItem) => {
            return eventItem.id === item.id
          })

          if(exists){
            return
          } else {
            Obj[date].push(dateObj)
          }
          
        } else {
          Obj[date] = [dateObj]
        }
      })
      
      // console.log("🦴", JSON.stringify(Obj));
      //convert into array

      if(Object.keys(Obj).length !== 0){
        const res = Object.keys(Obj).map((key) => ({
          date: key, 
          info: Obj[key]
        }));
        // console.log("🍏", JSON.stringify(res));

        setDateSortEvents(res)
      }
    }
    
  }, [tripEvents])
  
  
  const renderItem = ({ item }) => {
    let eventArr = item.info;
    return (
      <>
        <Text style={styles.date}>{item.date}</Text>
        {eventArr.map((eventObj) => {
          return(
            <View key={eventObj.id} style={styles.dayContainer}>
              <Text style={styles.dayTime}>{eventObj.time}</Text>
              <Text style={styles.dayEvent}>{eventObj.event_name}</Text>
            </View>
          )
        })}
      </>
    )
  }
  

  return (
    <>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
        {Array.isArray(dateSortEvents) && 
          <FlatList
            keyExtractor={(item) => item.id}
            data={dateSortEvents}
            renderItem={renderItem}
          />
        }

        <Modal visible={modalOpen} animationType="slide">
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name='window-close'
              size={24}
              style={{...styles.modalToggle, ...styles.modalClose}}
              onPress={() => setModalOpen(false)}
            />
            <AddTimeline setModalOpen={setModalOpen}/>
          </View>
        </Modal>
        
          <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.iconContainer}>
              <MaterialCommunityIcons
                name='plus'
                size={50}
                style={styles.modalToggle}
              />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer:{
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
    backgroundColor:'#9CCAEC'
  },

  iconContainer:{
    alignItems:"center",
    alignSelf:"flex-end",
    backgroundColor:'#F187A4',
    borderRadius: 40,
    justiftyContent:"center",
    margin:5,
    
    height:70,
    width:70,
    
    position:"absolute",
    right:0,
    bottom:10,

    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 7,
  },
  
  dayContainer:{
    marginTop:7,
    marginLeft:7
  },

  dayTime:{
    fontSize: 15,
  },

  dayEvent:{
    fontSize: 24,
    paddingLeft:20,
    paddingBottom: 10,
  },

  modalContent:{
    flex:1,
    margin:10,
  },
  modalToggle:{
    margin:10,
    alignSelf:"flex-end",
    color:'#fff',
  },
  modalClose:{
    margin:0,
    color:'black'
  }
})