import React, { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { MyTextInput, StyledDTPicker, BlueButton } from "../styles/globalStyles";
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';

import { EventContext } from '../context/EventContext';

import moment from 'moment';

export default function EditTimeline({ setModalOpen, EditData }) {
  const { editTripEvents, deleteTripEvents } = useContext(EventContext)

  // for time date picker
  const [date, setDate] = useState(new Date(EditData["event_date"]))
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
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
    console.log("?",info);
    editTripEvents(info)
    setModalOpen(false)
  }

  const deleteEvent = (info) => {
    deleteTripEvents(info)
    setModalOpen(false)
  }

  return (
    <>
      <KeyboardAvoidingWrapper>
        <Formik
          initialValues={
            EditData["description"] !== "There is no description yet" ? {
                eventName: EditData["event_name"],
                eventDate: date,
                event_id: EditData["id"],
                description: EditData["description"]
              } : {
                  eventName: EditData["event_name"],
                  eventDate: date,
                  event_id: EditData["id"],
                }
          }

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
                  value={date}
                  mode={mode}
                  is24Hour={false}
                  display="default"
                  onChange={(event, selectedDate) => {
                    console.log(selectedDate);
                    onChange(undefined, selectedDate)
                    props.setFieldValue('eventDate', selectedDate)
                    Keyboard.dismiss();
                  }}
                />
              )}
  
              <MyTextInput
                label="Event Description"
                icon="text"
                placeholder="Add a description for this event"
                value={props.values.description}
                onChangeText={props.handleChange('description')}
                multiline={true}
                numberOfLines={4}
              />
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
      </KeyboardAvoidingWrapper>
    </>
  )
};