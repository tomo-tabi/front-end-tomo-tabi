import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { globalStyles, AddButton, StyledModal, EditModal } from "../styles/globalStyles";

import { EventContext } from '../context/EventContext';

import moment from 'moment';

import AddTimeline from './AddTimeline';
import EditTimeline from './EditTimeline';

export default function TimeLine ({ route }) {
  const { id } = route.params;
  const { tripEvents, getTripEvents } = useContext(EventContext)

  const [ modalOpen, setModalOpen ] = useState(false);
  const [ dateSortEvents, setDateSortEvents ] = useState({}) 
  const [ modalEditOpen, setModalEditOpen ] = useState(false)
  const [ eventEditData, setEventEditData ] = useState({}) // Set the event I want to send to Edit Timeline component
  
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
          id: Obj[key][0]["id"],
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
          const objToSend = {}
          objToSend["date"] = moment(item["date"] + " " + eventObj["time"],"dddd, MMMM Do YYYY HH:mm A")
          objToSend["event_name"] = eventObj["event_name"]
          objToSend["event_id"] = eventObj["id"]
          return(
            <View key={eventObj.id} style={styles.dayContainer}>
              <Text style={styles.dayTime}>{eventObj.time}</Text>
              <Text style={styles.dayEvent} onPress={() => {setEventEditData(objToSend); setModalEditOpen(true) }}>{eventObj.event_name}</Text>
            </View>
          )
        })}
      </>
    )
  }

  return (
    <>
      <View style={globalStyles.container}>
        {Array.isArray(dateSortEvents) && 
          <FlatList
            keyExtractor={(item) => item.id}
            data={dateSortEvents}
            renderItem={renderItem}
          />
        }
        <StyledModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          AddComponent={AddTimeline}
        />

        <EditModal
        modalEditOpen={modalEditOpen}
        setModalEditOpen={setModalEditOpen}
        EditComponent={EditTimeline}
        EditData={eventEditData}
        />

        <AddButton
          setModalOpen={setModalOpen}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({

  date:{
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor:'#9CCAEC'
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
})