import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

import { globalStyles, colors, StyledModal, EditButton, BlueButton, VoteStat, } from "../styles/globalStyles";

const { primary, blue, yellow } = colors

import { EventContext } from '../context/EventContext';
import { TripContext } from '../context/TripContext';
import { VoteContext } from '../context/VoteContext';

import moment from 'moment';

import AddTimeline from './AddTimeline';
import EditTimeline from './EditTimeline';
import Timeline from 'react-native-timeline-flatlist'

import Dialog from "react-native-dialog";//New

export default function TimeLine({ navigation }) {
  const { trips, usersInTrip } = useContext(TripContext)
  const { tripVote } = useContext(VoteContext)
  const { tripEvents, tripid, modalOpen, setModalOpen } = useContext(EventContext)

  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [eventEditData, setEventEditData] = useState({}); // Set the event I want to send to Edit Timeline component

  const [visible, setVisible] = useState(true);
  const [filterEvents, setFilterEvents] = useState(null);
  const [filterSelect, setFilterSelect] = useState('');

  const [dayEvent, setDayEvent] = useState(null); 
  const [dayRange, setDayRange] = useState([]);
  const [dateSelected, setDateSelected] = useState(null); 

  const [eventVotesNum, setEventVotesNum] = useState(null); 

  const dayRangeRef = useRef();

  const dateFormat = (date) => {
    return moment(date).format("ddd, MMM DD");
  }
  
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
      // currentDateArr = [2022-12-21T00:00:00.000Z, {"focused": true, "index": 0}]
      const currentDateArr = dayRange.find((item) => {
        return item[1].focused === true
      });

      setDateSelected(moment(currentDateArr[0]).format('YYYY-MM-DD'));

      // currentEventArr = [{"description": null, "event_date": "2023-01-17T16:12:41.211Z", "event_name": "a", "id": 81, "trip_id": 11}]
      const currentEventArr = tripEvents.filter((item) => {
        return dateFormat(currentDateArr[0]) === dateFormat(item.event_date)
      });

      // for each dayEvent make new obj with below format
      const eventArrFormat = currentEventArr.map((item) => {
        if(!item.description){
          item.description = "There is no description yet"
        }
        return item
      });

      setDayEvent(eventArrFormat);
      // console.log(eventArrFormat);
    }

  }, [dayRange, tripEvents]);

  useEffect(() => {
    // set vote status for each day event
    if (!dayEvent || dayEvent.length === 0) { // no events
      return
    }
    
    const eventVote = {};

    dayEvent.forEach((item) => {
      return eventVote[item.id] = { true: 0, false:0, pend:0}
    });

    if (!tripVote) {
      return setEventVotesNum(eventVote);
    }
    
    if (tripVote && dayEvent) { //maybe return trip id with trip vote?
      if (Number(tripVote.tripid) === tripid) {
        (tripVote.tripVoteArray).forEach((item) => {
          if (eventVote[item.trips_events_id]){
            eventVote[item.trips_events_id][item.vote] ++
          }
        })
        return setEventVotesNum(eventVote);
      }
    }

  }, [tripVote, dayEvent]);

  const pressHandler = (eventName, id) => {
    navigation.navigate('Voting',{
      eventName: eventName,
      eventid: id
    })
  }; 

  const renderTime = (rowData) => {
    // console.log(eventVotesNum[rowData.id]);
    return (
      <View style={{ paddingHorizontal:5, }}>
        <Text style={{ fontWeight:'bold'}}>
          {moment(rowData.event_date).format("HH:mm A")}
        </Text>

        { eventVotesNum[rowData.id] &&
          <View style={{alignSelf:'flex-end'}}>
          {eventVotesNum[rowData.id].true !== 0 && <VoteStat text={eventVotesNum[rowData.id].true} status='accepted' name='check'/>}
          {eventVotesNum[rowData.id].false !== 0 && <VoteStat text={eventVotesNum[rowData.id].false} status='rejected' name='window-close'/>}
          {eventVotesNum[rowData.id].pend !== 0 &&<VoteStat text={eventVotesNum[rowData.id].pend} status='pending' name='dots-horizontal'/>}
        </View>}
      </View>
    )
  };
  
  const renderDetail = (rowData) => {

    let title = (
      <View style={{ flex:1, flexDirection: 'row', justifyContent: 'space-between', alignContent:'center'}}>
        <Text style={{textAlignVertical:'center', fontWeight:'bold', fontSize:20}}>{rowData.event_name} </Text>
        <EditButton
          setModalOpen={setModalEditOpen}
          setEditData={setEventEditData}
          editData={rowData}
        />
      </View>
    )
    let desc;
    if(rowData.description) {
      desc = (
        <View style={{flex:1 }}>
          <Text style={{flex:1, color:'#9E9E9E'}}>{rowData.description}</Text>
          <BlueButton
            onPress={() => pressHandler(rowData.event_name, rowData.id)}
            buttonText='Vote'
            style={{ padding:5, marginTop:5, marginBottom:0, alignSelf:'flex-end'}}
            textStyle={{fontSize:14}}
          />
        </View>
      )
    }

    return ( 
      <View style={{flex:1, marginTop:-10, backgroundColor: primary, borderRadius: 10, padding:5 }}>
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
        setDateSelected(moment(item[0]).format('YYYY-MM-DD'));
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
      <TouchableOpacity onPress={ () => {
        handelDatePress(item[0],index); 
        dayRangeRef.current.scrollToIndex({
          animated: true,
          index,
          viewOffset: Dimensions.get('window').width / 2.7,
        });
        }} >
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

  const filterOpt = [
    {key:'1', value:'No Filter'},
    {key:'2', value:'Pending'},
    {key:'3', value:'Accepted'},
    {key:'4', value:'Rejected'},
  ];

  const dummyVotes = [
    {
      trips_events_id: 95, 
      id:1,
      vote:false
    },
    {
      trips_events_id: 99, 
      id:2,
      vote:false
    },
    {
      trips_events_id: 96, 
      id:2,
      vote:true
    },
  ]

    // console.log(tripEvents);
  const handelFilterSelect = () => {
    if (filterSelect === 'No Filter') {
      setFilterEvents(dayEvent);
    } else {
      let filterState;

      switch (filterSelect) {
        case 'Pending':
          filterState = 'Pending';
          break;
        case 'Accepted':
          filterState = true;
          break;
        case 'Rejected':
          filterState = false;
          break;
      }

      const filterObj = {};

      dummyVotes.forEach((item) => { //event ids to filter
        // console.log(filterState,item.vote);
        return filterObj[item.trips_events_id] = item.vote !== undefined ? item.vote : 0
      })

      // console.log(filterSelect, filterObj);
      const filteredEvent = dayEvent.filter((item) => {
        if (filterSelect === "Pending") {
          return filterObj[item.id] === undefined
        } else {
          return filterObj[item.id] === filterState
        }
        // console.log(filterObj[item.trips_events_id]);
      })
      // console.log(filteredEvent)

      setFilterEvents(filteredEvent);
    }
  }

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
              ref={dayRangeRef}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }

        <SelectList 
          search={false}
          setSelected={(val) => {
            setFilterSelect(val);
          }} 
          data={filterOpt} 
          save="value"
          placeholder='No Filter'
          boxStyles={styles.filterBtn}
          inputStyles={styles.filterInput}
          dropdownStyles={styles.filterDropdown}
          dropdownTextStyles={styles.filterDropdownText}
          onSelect={handelFilterSelect}
        />
        
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
          dateSelected={dateSelected}
        />
        <StyledModal
          modalOpen={modalEditOpen}
          setModalOpen={setModalEditOpen}
          AddComponent={EditTimeline}
          EditData={eventEditData}
        />

        {dayEvent && dayEvent.length !== 0 && !filterEvents && eventVotesNum && eventVotesNum[dayEvent[0].id]?
          <Timeline
            style={styles2.list}
            data={dayEvent}
            renderDetail={renderDetail}
            renderTime={renderTime}
            circleSize={20}
            circleColor={blue}
            lineColor={blue}
            // timeContainerStyle={{ minWidth: 52 }}
            // timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
            options={{
              style: { marginTop: 5 },
            }}
            innerCircle={'dot'}
            separator={false}
            detailContainerStyle={{ flex: 1, marginBottom: 10, borderRadius: 10 }}
            isUsingFlatlist={true}
          />
          : ''
        }
        {filterEvents && 
          <Timeline
            style={styles2.list}
            data={filterEvents}
            renderDetail={renderDetail}
            renderTime={renderTime}
            circleSize={20}
            circleColor={blue}
            lineColor={blue}
            options={{
              style: { marginTop: 5 },
            }}
            innerCircle={'dot'}
            separator={false}
            detailContainerStyle={{ flex: 1, marginBottom: 10, borderRadius: 10 }}
            isUsingFlatlist={true}
          />
        }

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

  filterBtn:{
    borderRadius:25,
    backgroundColor:primary,
    alignSelf:'flex-end',
    paddingHorizontal:10,
    textAlign:'center',
    textAlignVertical:'center',
    // borderWidth:0,
    paddingVertical:5,
    borderColor:'#9E9E9E',
    // marginVertical:5,
  },
  filterInput:{
    color:'#9E9E9E',
    fontSize:14,

  },
  filterDropdown:{
    position: 'absolute',
    zIndex:6,
    backgroundColor:primary,
    borderColor:'#9E9E9E',
    alignSelf:'flex-end',
    marginTop:40,
    paddingVertical:0
  },
  filterDropdownText:{
    color:'#9E9E9E',
    alignSelf:'flex-end',
    margin:0,
  },
});