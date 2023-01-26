import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import { globalStyles, colors, AddButton, StyledModal, EditButton } from "../styles/globalStyles";
const { primary, blue, grey } = colors

import { EventContext } from '../context/EventContext';

import moment from 'moment';

import AddTimeline from './AddTimeline';
import EditTimeline from './EditTimeline';


import Timeline from 'react-native-timeline-flatlist'


import Dialog from "react-native-dialog";//New

export default function TimeLine({ navigation }) {
  const { tripEvents, tripid } = useContext(EventContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [dateSortEvents, setDateSortEvents] = useState({})
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [eventEditData, setEventEditData] = useState({}) // Set the event I want to send to Edit Timeline component

  const [dayViewData, setDayViewData] = useState([])

  const [visible, setVisible] = useState(true);


  //fetch one trip detail with trip id 
  
  useEffect(() => {
    setDayViewData([])
    if (tripEvents !== null) {
      // setDateSortEvents({});
      const Obj = {}
      tripEvents.map((item) => {
        let date = moment(item.event_date).format("dddd, MMM DD, YYYY");
        let time = moment(item.event_date).format("HH:mm A");

        if (item.trip_id !== tripid) {
          return
        }

        const dateObj = {
          trip_id: item.trip_id,
          event_name: item.event_name,
          time: time,
          id: item.id,
          description: item.description
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

  // const pressHandler = (eventName) => {
  //   navigation.navigate('Voting',{
  //     eventName: eventName
  //   })
  // } 

  const setDayData = (date, events) => {
    const eventArr = []

    events.forEach((event) => {
      const eventObject = {}
      const objToSendToEdit = {}
      objToSendToEdit["date"] = moment(date + " " + event["time"], "dddd, MMMM Do YYYY HH:mm A")
      objToSendToEdit["event_name"] = event["event_name"]
      objToSendToEdit["event_id"] = event["id"]
      objToSendToEdit["description"] = event["description"]


      eventObject["time"] = <Text> {event["time"]} </Text>
      eventObject["title"] = (
        //The width is set up by number. I really dont like this, but I dont know how to do it to make it look good
        <View style={{ width:261, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{event["event_name"]} </Text>
          <EditButton
            setModalOpen={setModalEditOpen}
            setEditData={setEventEditData}
            editData={objToSendToEdit}
          />
        </View>)
      eventObject["description"] = <Text> {event["description"] ? event["description"] : "There is no description yet" }</Text>

      eventArr.push(eventObject)
    })

    setDayViewData(eventArr)

  }


  const renderItem = ({ item, index }) => {
    index++
    let eventArr = item.info;
    return (
      <View
        // onPress={() => { console.log(eventArr); setDayData(item.date, eventArr); }}
        style={styles.dateView}
      >
        {/*
        We need to change the Day X or add all days of the trip.
        Not all days have events.
        Should we add all the empty days too and just say "No events today."?
        Or do  we only want to show the days that have events?
        */}
        <Text style={styles.dateText} onPress={() => { setDayData(item.date, eventArr); }}> Day {index}</Text>
        <Text>{item.date}</Text>
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
          <View style={{ height: 80 }}>
            <FlatList
              horizontal={true}
              keyExtractor={(item) => item.id}
              data={dateSortEvents}
              renderItem={renderItem}
            />
          </View>
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

        {dayViewData &&
          <Timeline
            style={styles2.list}
            data={dayViewData}
            circleSize={20}
            circleColor='rgb(45,156,219)'
            lineColor='rgb(45,156,219)'
            timeContainerStyle={{ minWidth: 52 }}
            timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
            descriptionStyle={{ color: 'gray' }}
            options={{
              style: { paddingTop: 5 }
            }}
            innerCircle={'dot'}
            separator={false}
            detailContainerStyle={{ marginBottom: 20, paddingLeft: 5, paddingRight: 5, backgroundColor: "#BBDAFF", borderRadius: 10 }}
            // columnFormat='two-column'
            isUsingFlatlist={true}
          />
        }

        {/* <EditModal
          modalEditOpen={modalEditOpen}
          setModalEditOpen={setModalEditOpen}
          EditComponent={EditTimeline}
          EditData={eventEditData}
        /> */}

        {/* <DayView
          setDayViewModal={setDayViewModal}
          dayViewModal={dayViewModal}
          dayViewData={dayViewData}
        /> */}

        <AddButton
          setModalOpen={setModalOpen}
        />
      </View>
    </>
  )
}


const styles2 = StyleSheet.create({
  container: {
    flex: 1,

    // height:0,
  },
  list: {
    flex: 1,
    // marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray'
  }
});

const styles = StyleSheet.create({
  dayAndEvent: {

    backgroundColor: 'black',
    // marginVertical: 10,
    borderRadius: 6,
    // overflow: 'hidden',
  },
  dateView: {
    padding: 20,
    borderRadius: 6,
    backgroundColor: blue,
    textAlign: 'center'
  },
  dateText: {
    fontSize: 24,
  },

  date: {
    fontWeight: "bold",
    fontSize: 24,

    // height: 80,
  },

  dayContainer: {
    backgroundColor: primary,
    paddingTop: 5,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
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