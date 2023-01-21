import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { MyTextInput, StyledDTPicker, BlueButton } from "../styles/globalStyles";
import DateTimePicker from '@react-native-community/datetimepicker';

import { EventContext } from '../context/EventContext';

import moment from 'moment';

export default function AddTimeline({ setModalOpen }) {
  const { postTripEvents } = useContext(EventContext)
  
  // for time date picker
  const [date, setDate] = useState(new Date())
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

  return(
    <>
      <Formik
        initialValues={{ eventName: '', eventDate: date }}
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
                value={date}
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
              onPress={props.handleSubmit}
              buttonText="Submit"
            />
          </View>
        )}

      </Formik>
    </>
  )
};