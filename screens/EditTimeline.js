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
  const [date, setDate] = useState(EditData["event_date"])
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;

    // console.log("change",moment(currentDate).format('h:mm A'));
    setShow(false);
    setDate(currentDate);
    Keyboard.dismiss();
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

  // const editEvent = (info) => {
  //   moment(date).format('h:mm A')
  //   console.log("?",info.eventDate);
  //   editTripEvents(info)
  //   setModalOpen(false)
  // }

  const deleteEvent = (info) => {
    deleteTripEvents(info)
    setModalOpen(false)
  }

  return (
    <>
      <KeyboardAvoidingWrapper>
        <Formik
          initialValues={{
            eventName: EditData["event_name"],
            eventDate: date,
            event_id: EditData["id"],
            description: EditData["description"]
          }}
          onSubmit={(values) => {
            console.log("subEd",moment(values.eventDate).format('h:mm A'));
            editTripEvents(values);
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
                  onChange={(event, selectedDate) => {
                    console.log("DT change",moment(selectedDate).format('h:mm A'));
                    onChange(undefined, selectedDate)
                    props.setFieldValue('eventDate', selectedDate)
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
                onPress={props.handleSubmit}
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