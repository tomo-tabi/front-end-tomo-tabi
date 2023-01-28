import React, { useState, useContext } from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';//change
import { Formik } from 'formik';
import { MyTextInput, StyledDTPicker, BlueButton } from "../styles/globalStyles";
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';

import { EventContext } from '../context/EventContext';
import { TripContext } from '../context/TripContext';//add

import moment from 'moment';

export default function AddTimeline({ setModalOpen }) {
  const { postTripEvents, tripid } = useContext(EventContext)//change
  const { trips } = useContext(TripContext)//add


  // for time date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  //get trip info(id, name, duration)
  function getID(arr) {
    return arr.id === tripid;
  }
  const getTripInfo = trips.find(getID);
  const startDate = new Date(getTripInfo.start_date);
  const endDate = new Date(getTripInfo.end_date);
  // const adjustEndDate = new Date(getTripInfo.end_date);
  // adjustEndDate.setDate(adjustEndDate.getDate()+1);
  // console.log(getTripInfo);
  // console.log(startDate)
  // console.log(endDate)
  // console.log(adjustEndDate)

  //change
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    if (currentDate.getTime() < startDate.getTime() || currentDate.getTime() > endDate) {
      setShow(false);
      Alert.alert('Wrong date!', 'Please choose a date between ' +
        moment(startDate).format('dddd, MMMM Do') + ' and ' +
        moment(endDate).format('dddd, MMMM Do') + ' !',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);

    } else {
      setShow(false);
      setDate(currentDate);
    }
  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    setDate(startDate);//add
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <> 
      <KeyboardAvoidingWrapper>
        <Formik
          initialValues={{ eventName: '', eventDate: date, description: '' }}
          onSubmit={(values) => {
            postTripEvents(values);
            setModalOpen(false);
          }}
        >
          {(props) => (
            <View>
              <MyTextInput
                label="Event Name"
                icon="account-outline"
                placeholder="Grand Canyon"
                onChangeText={props.handleChange('eventName')}
                value={props.values.eventName}
              />
  
              {/* <Text>Please choose a day between</Text>
              <Text style={styles.date}>
                {moment(startDate).format('MMMM Do')} and {moment(endDate).format('MMMM Do')}!
              </Text> */}
              <StyledDTPicker
                label="Event Date"
                onPress={showDatepicker}
                iconName="calendar-blank-outline"
                value={moment(date).format('dddd, MMMM Do YYYY')}
              />
              <StyledDTPicker
                label="Event Time"
                onPress={showTimepicker}
                iconName="clock-outline"
                value={moment(date).format('h:mm A')}
              />
  
              <MyTextInput
                label="Event Description"
                icon="text"
                placeholder="Add a description for this event"
                value={props.values.description}
                onChangeText={props.handleChange('description')}
                multiline={true}
                numberOfLines={4}
              />
  
              {/* <Text>Event Date: </Text>
              <TouchableOpacity onPress={showDatepicker} style={globalStyles.textInput}>
                <MaterialCommunityIcons name='calendar-blank-outline' size={30}/>
                <Text style={globalStyles.textInputText}>{moment(date).format('dddd, MMMM Do YYYY')}</Text>
              </TouchableOpacity> */}
              {/* <Text>Event Time: </Text>
              <TouchableOpacity onPress={showTimepicker} style={globalStyles.textInput}>
                <MaterialCommunityIcons name='clock-outline' size={30}/>
                <Text style={globalStyles.textInputText}>{moment(date).format('h:mm A')}</Text>
              </TouchableOpacity> */}
  
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  minimumDate={startDate}
                  maximumDate={endDate}
                  value={date}
                  mode={mode}
                  is24Hour={false}
                  display="default"
                  onChange={(event, selectedDate) => {
                    onChange(undefined, selectedDate)
                    props.setFieldValue('eventDate', selectedDate)
                  }}
                />
              )}
              <BlueButton
                onPress={props.handleSubmit}
                buttonText="Submit"
              />
            </View>
          )}
  
        </Formik>
      </KeyboardAvoidingWrapper>
    </>
  )
};

//add
const styles = StyleSheet.create({
  date: {
    fontWeight: "bold",
    fontSize: 17,
    color: "green"
  },

})