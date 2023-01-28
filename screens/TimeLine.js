import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import { globalStyles, colors, AddButton, StyledModal, EditButton, BlueButton } from "../styles/globalStyles";
const { primary, blue, yellow } = colors

import { EventContext } from '../context/EventContext';
import { TripContext } from '../context/TripContext';

import moment from 'moment';

import AddTimeline from './AddTimeline';
import EditTimeline from './EditTimeline';
import Timeline from 'react-native-timeline-flatlist'

import Dialog from "react-native-dialog";//New

export default function TimeLine({ navigation }) {
  const { trips, getUsersInTrip } = useContext(TripContext)
  const { tripEvents, tripid } = useContext(EventContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [eventEditData, setEventEditData] = useState({}); // Set the event I want to send to Edit Timeline component

  const [visible, setVisible] = useState(true);

  const [dayEvent, setDayEvent] = useState(null); //new
  const [dayRange, setDayRange] = useState([]); //new

  const dateFormat = (date) => {
    return moment(date).format("ddd, MMM DD");
  }

  useEffect(() => {
    getUsersInTrip(tripid)
  },[]);
  
  useEffect(() => {
    //set up day range
    if (dayRange.length !== 0 ) {
      return
    }

    let currentTrip = trips.find((trip) => trip.id === tripid );
    let startDateTrip = new Date(currentTrip.start_date);
    let lastDateTrip = new Date(currentTrip.end_date); 

    let index = 0;

    for(let day = startDateTrip ; day <= lastDateTrip ; day.setDate(day.getDate() + 1)) {
      dayRange.push([new Date(day),{focused: index === 0 ? true : false, index: index}]);
      // array of [[2022-12-21T00:00:00.000Z, {"focused": true, "index": 0}], ...]
      index ++;
    };

  }, [tripEvents]);

  useEffect(() => {
    //set day event depending on date selected 
    if (Array.isArray(dayRange) && tripEvents !== null ) {
      // console.log(dayRange);
      const currentDateArr = dayRange.find((item) => {
       return item[1].focused === true
      });

      const currentEventArr = tripEvents.filter((item) => {
        return dateFormat(currentDateArr[0]) === dateFormat(item.event_date)
      });
      // console.log(currentDateArr);

      const eventArrFormat = currentEventArr.map((item) => {
        return {
          time: item.event_date,
          title: item.event_name,
          description: item.description ? item.description : "There is no description yet",
          id: item.id
        }
      });

      setDayEvent(eventArrFormat);
      // console.log(eventArrFormat);
    }

  }, [dayRange, tripEvents]);

  const pressHandler = (eventName, id) => {
    navigation.navigate('Voting',{
      eventName: eventName,
      eventid: id
    })
  }; 

  const renderTime = (rowData) => {
    // console.log(rowData.time);
    return (
      <View >
        <Text style={{borderRadius:20, backgroundColor:yellow, padding:5, paddingHorizontal:5}}>
          {moment(rowData.time).format("HH:mm A")}
        </Text>
      </View>
    )
  };
  
  const renderDetail = (rowData) => {
    
    const editData = {
      "date": rowData.time,
      "event_name": rowData["event_name"],
      "event_id": rowData["id"],
      "description": rowData["description"]
    }

    let title = (
      <View style={{ flex:1, flexDirection: 'row', justifyContent: 'space-between', alignContent:'center'}}>
        <Text style={{textAlignVertical:'center', fontWeight:'bold', fontSize:20}}>{rowData.title} </Text>
        <EditButton
          setModalOpen={setModalEditOpen}
          setEditData={setEventEditData}
          editData={editData}
        />
      </View>
    )
    let desc;
    if(rowData.description) {
      desc = (
        <View style={{flex:1 }}>
          <Text style={{flex:1, color:'#9E9E9E'}}>{rowData.description}</Text>
          <BlueButton
            onPress={() => pressHandler(rowData.title, rowData.id)}
            buttonText='Vote'
            style={{ padding:5, marginTop:5, marginBottom:0, alignSelf:'flex-end'}}
            textStyle={{fontSize:14}}
          />
        </View>
      )
    }

    return (
      <View style={{flex:1 }}>
        {title}
        {desc}
      </View>
    )
  };

  const handelDatePress = (date, index) => {

    const sameDate = dayRange.find((item) => {
      return item[1].index === index && item[1].focused === true
    })
    
    if (sameDate) {
      return
    };

    const newDayRange = dayRange.map((item) => {
      if (item[1].index === index && item[1].focused === false) {
        item[1].focused = true;
      } else {
        item[1].focused = false;
      }
      return item
    });

    setDayRange(newDayRange);
  };

  const renderDayHorizontal = ({ item, index }) => {
    let focused = item[1].focused;

    return (
      <View style={{ flex:1, margin:5, padding:5, borderRadius:6, backgroundColor: focused ? blue : primary}}>
      <TouchableOpacity onPress={ () => handelDatePress(item[0],index)} >
        <Text style={[styles.dateText,{color:focused ? primary :'#9E9E9E'}]} > Day {index + 1}</Text>
        <Text style={{fontSize:14, color:focused ? primary :'#9E9E9E', marginTop:5}}>{dateFormat(item[0])}</Text>
      </TouchableOpacity>
      </View>
    )
  };

  // handle pop up message
  const hideDialog = () => {
    setVisible(false);
  };

  return (
    <>
      <View style={globalStyles.container}>
        {Array.isArray(dayRange) &&
          <View style={{ height: 80 }}>
            <FlatList
              horizontal={true}
              keyExtractor={(item, i) => i}
              data={dayRange}
              renderItem={renderDayHorizontal}
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
              <Dialog.Button label="OK" style={styles.dialogButton} onPress={hideDialog} />
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

        {dayEvent &&
          <Timeline
            style={styles2.list}
            data={dayEvent}
            renderDetail={renderDetail}
            renderTime={renderTime}
            circleSize={20}
            circleColor='rgb(45,156,219)'
            lineColor='rgb(45,156,219)'
            // timeContainerStyle={{ minWidth: 52 }}
            // timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
            options={{
              style: { paddingTop: 5 }
            }}
            innerCircle={'dot'}
            separator={false}
            detailContainerStyle={{ flex: 1, marginBottom: 20, paddingHorizontal: 5, backgroundColor: primary, borderRadius: 10 }}
            isUsingFlatlist={true}
          />
        }

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
  },
  list: {
    flex: 1,
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
    borderRadius: 6,
  },
  dateView: {
    padding: 20,
    borderRadius: 6,
    backgroundColor: blue,
    textAlign: 'center'
  },
  dateText: {
    fontSize: 24,
    textAlign:'center',
  },

  date: {
    fontWeight: "bold",
    fontSize: 24,
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
});