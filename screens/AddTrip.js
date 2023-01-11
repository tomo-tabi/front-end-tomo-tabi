import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, TouchableOpacity } from 'react-native';
import { Octicons, Ionicons, Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    StyledContainer,
    StyledTextInput,
    LeftIcon,
    StyledInputLabel,
    Colors, 
} from '../styles/styles';

const {brand, darkLight} = Colors;

export default function AddTrip(params) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2023, 0, 1));
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setStartDate(currentDate);
    setEndDate(currentDate);
  }

  const showDatePicker = () => {
    setShow(true);
  }

  return(
    <View style={StyledContainer}>

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
        initialValues={{ startDate: '', endDate: '', userid: '', name: '' }}
        onSubmit={(values) =>{
          values = {...values, startDate: startDate, endDate: endDate}
          console.log(values);
        }}
      >
        {(props) => (
          <View>
            <MyTextInput 
              label="Trip Name"
              icon="airplane-sharp"
              placeholder="Go to Japan"
              onChangeText={props.handleChange('name')}
              value={props.values.name}
            />

            <MyTextInput 
              label="Start Date"
              icon="calendar"
              placeholder="YYYY-MM-DD"
              onChangeText={props.handleChange('startDate')}
              value={startDate ? startDate.toDateString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
            />

            <MyTextInput 
              label="End Date"
              icon="calendar"
              placeholder="YYYY-MM-DD"
              onChangeText={props.handleChange('endDate')}
              value={endDate ? endDate.toDateString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
             
            />

            <Button title='Add new trip' color= 'maroon' onPress={props.handleSubmit} />
          </View>
        )}
      </Formik>
    </View>

  );
  
};

const MyTextInput = ( { label, icon, isDate, showDatePicker, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Ionicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            {!isDate && <StyledTextInput {...props} />}
            {isDate && (
              <TouchableOpacity onPress={showDatePicker}>
                <StyledTextInput {...props} />
              </TouchableOpacity>
            )}
            
        </View>
    );
};