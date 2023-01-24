import React, { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { MyTextInput, StyledDTPicker, BlueButton } from "../styles/globalStyles";
import DateTimePicker from '@react-native-community/datetimepicker';

import { EventContext } from '../context/EventContext';

import moment from 'moment';

export default function EditTimeline({ setModalEditOpen, EditData }) {
  const { editTripEvents, deleteTripEvents } = useContext(EventContext)
  
  // for time date picker
  const [date, setDate] = useState(EditData["date"])
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
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
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const editEvent = (info) => {
    editTripEvents(info)
    setModalEditOpen(false)
  }

  const deleteEvent = (info) => {
    deleteTripEvents(info)
    setModalEditOpen(false)
  }

  return(
    <>
      <Formik
        initialValues={{ 
            eventName: EditData["event_name"], 
            eventDate: date,
            event_id: EditData["event_id"],
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

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(date)}
                mode={mode}
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate)=> {
                  onChange(undefined,selectedDate)
                  props.setFieldValue('eventDate',selectedDate)
                }}
              />
            )}
            <BlueButton
            onPress={() => {editEvent(props.values)}}
              buttonText="Submit Edit"
            />
            <BlueButton
              onPress={() => deleteEvent(props.values)}
              buttonText="Delete Event"
            />
          </View>
        )}

      </Formik>
    </>
  )
};