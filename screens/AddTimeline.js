import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Formik} from 'formik';

import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
} from '../styles/styles';

import { InfoContext } from '../context/InfoContext';

export default function AddTimeline() {
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const { postTripEvents } = useContext(InfoContext);

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
    <View style={styles.container}>
      <Formik
        initialValues={{ eventName: '', eventDate: '', eventTime: '' }}
        onSubmit={(values) => {
          postTripEvents(values)
        }}
      >
        {(props) => (
          <View>
            <MyTextInput
              label="Event Name"
              icon="person"
              placeholder="Grand Canyon"
              onChangeText={props.handleChange('eventName')}
              value={props.values.eventName}
            />

            <Text>Event Date: </Text>
            <TouchableOpacity onPress={showDatepicker} style={styles.timeDate}>
              <MaterialCommunityIcons name='calendar-blank-outline' size={30}/>
              <Text style={styles.timeDateText}>{moment(date).format('dddd, MMMM Do YYYY')}</Text>
            </TouchableOpacity>

            <Text>Event Time: </Text>
            <TouchableOpacity onPress={showTimepicker} style={styles.timeDate}>
              <MaterialCommunityIcons name='clock-outline' size={30}/>
              <Text style={styles.timeDateText}>{moment(date).format('h:mm A')}</Text>
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate)=> {
                  onChange(undefined,selectedDate)
                  props.setFieldValue('eventDate',moment(selectedDate).format('YYYY-MM-DD'))
                }}
              />
            )}

            <StyledButton onPress={props.handleSubmit}>
                <ButtonText>
                    Submit
                </ButtonText>
            </StyledButton>
          </View>
        )}

      </Formik>
    </View>
  )
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },
  timeDate:{
    flexDirection:'row',
    alignItems:'center',
    padding: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 60,
    marginVertical: 3,
    marginBottom: 10,
    backgroundColor:'#E5E7EB'
  },
  timeDateText:{
    marginLeft:14,
    fontSize: 16
  }

})
const MyTextInput = ( { label, icon, ...props }) => {
  return (
      <View>
          <LeftIcon>
              <Octicons name={icon} size={30} />
          </LeftIcon>
          <StyledInputLabel>{label}</StyledInputLabel>
          <StyledTextInput {...props} />
      </View>
  );
};