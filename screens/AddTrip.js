import { Formik } from 'formik';
import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { InfoContext } from '../context/InfoContext';
import { StyleSheet, Button, TextInput, View, TouchableOpacity } from 'react-native';
import { Octicons, Ionicons, Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import jwt_decode from "jwt-decode";
import {
    StyledContainer,
    StyledTextInput,
    LeftIcon,
    StyledInputLabel,
    Colors, 
} from '../styles/styles';


const {brand, darkLight} = Colors;

export default function AddTrip({setModalOpen}) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2023, 0, 1));
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { userToken } = useContext(AuthContext);
  // console.log("🍶",userToken);
  const getId = jwt_decode(userToken).userid;
  // console.log(getId);
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
          values = {...values, userid: getId, startDate: moment(startDate).format("YYYY-MM-DD"), endDate: moment(endDate).format("YYYY-MM-DD")}
          postNewTrip(values);
          // console.log(values);
          getTrips();
          setModalOpen(false);
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