import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Formik } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, StyledButton, StyledInputLabel, StyledTextInput } from "../styles/globalStyles";
import DateTimePicker from '@react-native-community/datetimepicker';

import { InfoContext } from '../context/InfoContext';

import moment from 'moment';

export default function AddTrip({setModalOpen}) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { postNewTrip, getTrips } = useContext(InfoContext);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    if (!startDate && !endDate) {
      setStartDate(currentDate);
    }else if (startDate && !endDate) {
      setEndDate(currentDate);
    }
     // user is choosing another range => set the start date
    // and set the endDate back to null
    if (startDate && endDate) {
      setStartDate(currentDate);
      setEndDate(null);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return(
    <View style={{paddingHorizontal: 10,paddingTop:10,}}>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode='date'
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <Formik
        initialValues={{ startDate: '', endDate: '', name: '' }}//remove userid
        onSubmit={(values) =>{
          values = {...values, startDate: moment(startDate).format("YYYY-MM-DD"), endDate: moment(endDate).format("YYYY-MM-DD")}
          postNewTrip(values);
          getTrips();
          setModalOpen(false);
        }}
      >
        {(props) => (
          <View>
            <MyTextInput 
              label="Trip Name"
              icon="airplane"
              placeholder="Go to Japan"
              onChangeText={props.handleChange('name')}
              value={props.values.name}
            />

            <MyTextInput 
              label="Start Date"
              icon="calendar-blank-outline"
              placeholder="YYYY-MM-DD"
              onChangeText={props.handleChange('startDate')}
              value={startDate ? startDate.toDateString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
            />

            <MyTextInput 
              label="End Date"
              icon="calendar-blank-outline"
              placeholder="YYYY-MM-DD"
              onChangeText={props.handleChange('endDate')}
              value={endDate ? endDate.toDateString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
            />

            <StyledButton onPress={props.handleSubmit}>
              <Text style={globalStyles.buttonText}>Add New Trip</Text>
            </StyledButton>
          </View>
        )}
      </Formik>
    </View>

  );
  
};

const MyTextInput = ( { label, icon, isDate, showDatePicker, ...props }) => {
    return (
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>
            <View style={globalStyles.textInput}>
              <MaterialCommunityIcons name={icon} size={30}/>
              {!isDate && <StyledTextInput {...props} />}
              {isDate && (
                <TouchableOpacity onPress={showDatePicker}>
                  <StyledTextInput {...props} />
                </TouchableOpacity>
              )}
            </View>
            
        </View>
    );
};