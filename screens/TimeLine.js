import React, { useState, useEffect, useContext } from 'react';
<<<<<<< HEAD
import { StyleSheet, Text, FlatList, View} from 'react-native';
import { globalStyles, AddButton, StyledModal, EditModal } from "../styles/globalStyles";
=======
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { globalStyles, colors, AddButton, StyledModal, EditModal, EditButton } from "../styles/globalStyles";
const {primary, blue, grey} = colors
>>>>>>> 6108653d3580a6d3a27e581ba36e1e92a42cb006

import { EventContext } from '../context/EventContext';

import moment from 'moment';

import AddTimeline from './AddTimeline';
import EditTimeline from './EditTimeline';

import Dialog from "react-native-dialog";//New

export default function TimeLine({ route }) {
  const { id } = route.params;
  const { tripEvents, getTripEvents } = useContext(EventContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [dateSortEvents, setDateSortEvents] = useState({})
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [eventEditData, setEventEditData] = useState({}) // Set the event I want to send to Edit Timeline component
  const [visible, setVisible] = useState(true);

  //fetch one trip detail with trip id 

  useEffect(() => {
    setDateSortEvents({});// don't know if I need it, will look into later
    getTripEvents(id);
  }, [id])

  useEffect(() => {
    if (tripEvents !== null) {
      // setDateSortEvents({});
      const Obj = {}
      tripEvents.map((item) => {
        let date = moment(item.event_date).format("dddd, MMM DD, YYYY");
        let time = moment(item.event_date).format("HH:mm A");

        if (item.trip_id !== id) {
          return
        }

        const dateObj = {
          trip_id: item.trip_id,
          event_name: item.event_name,
          time: time,
          id: item.id
        }

        if (Obj[date]) {
          let exists = Obj[date].find((eventItem) => {
            return eventItem.id === item.id
          })

          if (exists) {
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

      if (Object.keys(Obj).length !== 0) {
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
      <View style={styles.dayAndEvent}>
        <Text style={styles.date}>{item.date}</Text>
        {eventArr.map((eventObj, i) => {
          const objToSend = {}
          objToSend["date"] = moment(item["date"] + " " + eventObj["time"], "dddd, MMMM Do YYYY HH:mm A")
          objToSend["event_name"] = eventObj["event_name"]
          objToSend["event_id"] = eventObj["id"]
          
          let viewStyle = styles.dayContainer;

          if (eventArr.length - 1 !== i ){
            viewStyle=[styles.dayContainer, {
              borderBottomColor:grey,
              borderBottomWidth:1,
            }];
          }

          return (
            <View key={eventObj.id} style={viewStyle}>
              <View style={{flexDirection:'column'}}>
                {/* <Text style={styles.dayTime}>{eventObj.time}</Text> */}
                <Text style={styles.dayEvent}>▪︎ {eventObj.event_name}</Text>
              </View>
              
              <EditButton
                  setModalOpen={setModalEditOpen}
                  setEditData={setEventEditData}
                  editData={objToSend}
                />
            </View>
          )
        })}
      </View>
    )
  }
  

  // handle pop up message
  const hideDialog = () => {
    setVisible(false);
  };

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
        {tripEvents === null &&
          <View>
            <Dialog.Container visible={visible}>
              <Dialog.Title style={styles.dialogTitle}>There is no event now!</Dialog.Title>
              <Dialog.Description style={styles.dialogDescription}>
              Create new events to enhance your travels!
              </Dialog.Description>
              <Dialog.Button label="OK" style={styles.dialogButton} onPress={hideDialog}/>
            </Dialog.Container>
          </View>
        }
        <StyledModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          AddComponent={AddTimeline}
        />
        <StyledModal
          modalOpen={modalEditOpen}
          setModalOpen={setModalEditOpen}
          AddComponent={EditTimeline}
          EditData={eventEditData}
        />

        {/* <EditModal
          modalEditOpen={modalEditOpen}
          setModalEditOpen={setModalEditOpen}
          EditComponent={EditTimeline}
          EditData={eventEditData}
        /> */}

        <AddButton
          setModalOpen={setModalOpen}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  dayAndEvent:{
    backgroundColor:primary, 
    marginVertical:10,
    borderRadius: 6,
    overflow:'hidden'
  },

  date: {
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    borderRadius: 6,
    backgroundColor: blue
  },

  dayContainer: {
    backgroundColor: primary,
    paddingTop: 5,
    paddingRight: 5,
    flexDirection:'row', 
    justifyContent:'space-between',
  },

  dayTime: {
    fontSize: 15,
  },

  dayEvent: {
    fontSize: 24,
    paddingLeft: 20,
    paddingBottom: 10,
  },

  dialogTitle: {
    fontSize: 25,
    color: "darkcyan"
  },

  dialogDescription: {
    fontWeight: 'bold', 
    color: 'goldenrod'
  },
  
  dialogButton: {
    fontWeight: 'bold'
  },
})