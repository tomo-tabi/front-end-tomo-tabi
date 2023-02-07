import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

import { globalStyles, colors, StyledModal, EditButton, BlueButton, VoteStat, NoItemMessage } from "../styles/globalStyles";

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
  const { trips, permission, owner } = useContext(TripContext)
  const { tripVote, userTripVote } = useContext(VoteContext)
  const { tripEvents, tripid, modalOpen, setModalOpen } = useContext(EventContext)

  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [eventEditData, setEventEditData] = useState({}); // Set the event I want to send to Edit Timeline component

  const [visible, setVisible] = useState(true);
  const [filterEvents, setFilterEvents] = useState(null);
  const [filterSelect, setFilterSelect] = useState('');

  const [dayEvent, setDayEvent] = useState([]);
  const [dayRange, setDayRange] = useState([]);
  const [dateSelected, setDateSelected] = useState(null);

  const dayRangeRef = useRef();

  const dateFormat = (date) => {
    return moment(date).format("ddd, MMM DD");
  }

  useEffect(() => {
    //set up day range

    let currentTrip = trips.find((trip) => trip.id === tripid);
    let startDateTrip = new Date(currentTrip.start_date);
    let lastDateTrip = new Date(currentTrip.end_date);

    let index = 0;
    let dayRangeArr = [];

    for (let day = startDateTrip; day <= lastDateTrip; day.setDate(day.getDate() + 1)) {
      dayRangeArr.push([new Date(day), { focused: index === 0 ? true : false, index: index }]);
      // array of [[2022-12-21T00:00:00.000Z, {"focused": true, "index": 0}], ...]
      index++;
    };

    setDayRange(dayRangeArr);

  }, [tripEvents]);

  useEffect(() => {
    //set day event depending on date selected 
    if (Array.isArray(dayRange) && tripEvents !== null && dayRange.length !== 0) {
      if (tripEvents[0].trip_id !== tripid) {
        return
      }
      // currentDateArr = [2022-12-21T00:00:00.000Z, {"focused": true, "index": 0}]
      const currentDate = dayRange.find((item) => {
        return item[1].focused === true
      });

      setDateSelected(moment(currentDate[0]).format('YYYY-MM-DD'));// should I make this default to first day with event?

      // currentEventArr = [{"description": null, "event_date": "2023-01-17T16:12:41.211Z", "event_name": "a", "id": 81, "trip_id": 11}]
      const currentEventArr = tripEvents.filter((item) => {
        return dateFormat(currentDate[0]) === dateFormat(item.event_date)
      });

      // for each dayEvent make new obj with below format
      const eventArrFormat = currentEventArr.map((item) => {
        if (!item.description) {
          item.description = "There is no description yet"
        }
        return { ...item, vote: { true: 0, false: 0 } }
      });

      if (eventArrFormat.length !== 0 && tripVote && Number(tripVote.tripid) === tripid) {

        (tripVote.tripVoteArray).forEach((item) => {
          for (const event of eventArrFormat) {
            if (event.id === item.trips_events_id) {
              event.vote[item.vote]++
            }
          }
        });
      }

      return setDayEvent(eventArrFormat);
    }

  }, [dayRange, tripEvents, tripVote]);

  const pressHandler = (eventName, id) => {
    navigation.navigate('Voting', {
      eventName: eventName,
      eventid: id
    })
  };

  const renderTime = (rowData) => {
    return (
      <View style={{ paddingHorizontal: 5, }}>
        <Text style={{ fontWeight: 'bold' }}>
          {moment(rowData.event_date).format("HH:mm A")}
        </Text>

        <View style={{ alignSelf: 'flex-end' }}>
          {rowData.vote.true !== 0 &&
            <VoteStat
              text={rowData.vote.true}
              status='accepted'
              name='check'
              onPress={() => pressHandler(rowData.event_name, rowData.id)}
            />}
          {rowData.vote.false !== 0 &&
            <VoteStat
              text={rowData.vote.false}
              status='rejected'
              name='window-close'
              onPress={() => pressHandler(rowData.event_name, rowData.id)}
            />}
        </View>

      </View>
    )
  };

  const renderDetail = (rowData) => {

    let title = (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
        <Text style={{ textAlignVertical: 'center', fontWeight: 'bold', fontSize: 20 }}>{rowData.event_name} </Text>
        {owner ? <EditButton
          setModalOpen={setModalEditOpen}
          setEditData={setEventEditData}
          editData={rowData}
        />
          :
          permission ?
            null
            :
            <EditButton
              setModalOpen={setModalEditOpen}
              setEditData={setEventEditData}
              editData={rowData}
            />}
      </View>
    )
    let desc;
    if (rowData.description) {
      desc = (
        <View style={{ flex: 1 }}>
          <Text style={{ flex: 1, color: '#9E9E9E' }}>{rowData.description}</Text>
          <BlueButton
            onPress={() => pressHandler(rowData.event_name, rowData.id)}
            buttonText='Vote'
            style={{ padding: 5, marginTop: 5, marginBottom: 0, alignSelf: 'flex-end' }}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      )
    }

    return (
      <View style={{ flex: 1, marginTop: -10, backgroundColor: primary, borderRadius: 10, padding: 5 }}>
        {title}
        {desc}
      </View>
    )
  };

  const handelDatePress = (index) => {

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
      <View style={{ flex: 1, margin: 5, padding: 5, borderRadius: 6, backgroundColor: focused ? blue : primary }}>
        <TouchableOpacity onPress={() => {
          handelDatePress(index);
          dayRangeRef.current.scrollToIndex({
            animated: true,
            index,
            viewOffset: Dimensions.get('window').width / 2.7,
          });
        }} >
          <Text style={[styles.dateText, { color: focused ? primary : '#9E9E9E' }]} > Day {index + 1}</Text>
          <Text style={{ fontSize: 14, color: focused ? primary : '#9E9E9E', marginTop: 5 }}>{dateFormat(item[0])}</Text>
        </TouchableOpacity>
      </View>
    )
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const filterOpt = [
    { key: '1', value: 'No Filter' },
    { key: '2', value: 'Pending' },
    { key: '3', value: 'Accepted' },
    { key: '4', value: 'Rejected' },
  ];

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

      if (userTripVote) {

        (userTripVote.userTripVotesArray).forEach((item) => { //event ids to filter
          return filterObj[item.trips_events_id] = item.vote !== undefined ? item.vote : 0
        })

        const filteredEvent = dayEvent.filter((item) => {
          if (filterSelect === "Pending") {
            return filterObj[item.id] === undefined
          } else {
            return filterObj[item.id] === filterState
          }
        });

        setFilterEvents(filteredEvent);
      };

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
        {dayEvent.length === 0 &&
          <View style={[{ flex: 1, marginTop: 5 }]}>
            <NoItemMessage text='No Events Yet!' style={{ height: 100, textAlignVertical: 'center', }} />
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

        {dayEvent.length !== 0 && !filterEvents ?
          <Timeline
            style={styles2.list}
            data={dayEvent}
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
    textAlign: 'center',
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

  filterBtn: {
    borderRadius: 25,
    backgroundColor: primary,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 5,
    borderColor: '#9E9E9E',
  },
  filterInput: {
    color: '#9E9E9E',
    fontSize: 14,

  },
  filterDropdown: {
    position: 'absolute',
    zIndex: 6,
    backgroundColor: primary,
    borderColor: '#9E9E9E',
    alignSelf: 'flex-end',
    marginTop: 40,
    paddingVertical: 0
  },
  filterDropdownText: {
    color: '#9E9E9E',
    alignSelf: 'flex-end',
    margin: 0,
  },
});