import React, { useState, useContext } from 'react';
import { View, Keyboard } from 'react-native';
import { Formik } from 'formik';
import { StyledDTPicker, MyTextInput, BlueButton } from "../styles/globalStyles";
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-neat-date-picker'

import { TripContext } from '../context/TripContext';

import moment from 'moment';

export default function AddTrip({setModalOpen}) {
  const { postTrip, getTrips } = useContext(TripContext);
  
  const [show, setShow] = useState(false);
  // const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShow(false);
  //   setDate(currentDate);
  //   if (!startDate && !endDate) {
  //     setStartDate(currentDate);
  //   }else if (startDate && !endDate) {
  //     setEndDate(currentDate);
  //   }
  //    // user is choosing another range => set the start date
  //   // and set the endDate back to null
  //   if (startDate && endDate) {
  //     setStartDate(currentDate);
  //     setEndDate(null);
  //   }
  // };

  const showDatePicker = () => {
    setShow(true);
    Keyboard.dismiss();
  };

  const onCancel = () => {
    setShow(false);
  }

  const onConfirm = (output) => {
    setShow(false);
    const { startDate, startDateString, endDate, endDateString } = output
    setStartDate(startDate);
    setEndDate(endDate);
    console.log(startDateString, endDateString);
  }

  return(
    <View style={{paddingHorizontal: 10,paddingTop:10,}}>
      {show && (
        // <DateTimePicker
        //   testID="dateTimePicker"
        //   value={date}
        //   mode='date'
        //   is24Hour={false}
        //   onChange={onChange}
        // />
        <DatePicker
          isVisible={show}
          mode={'range'}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}

      <Formik
        initialValues={{ startDate: '', endDate: '', name: '' }}
        onSubmit={(values) => {
          values = {...values, startDate: moment(startDate).format("YYYY-MM-DD"), endDate: moment(endDate).format("YYYY-MM-DD")}
          console.log("formik",startDate, endDate);
          console.log(values);
          postTrip(values);
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
            <StyledDTPicker
              label="Start Date and End Date"
              onPress={showDatePicker}
              iconName="calendar-blank-outline"
              value={startDate && endDate ? `${startDate.toDateString()} - ${endDate.toDateString()}` : ''}
              placeholder="YYYY MM DD - YYYY MMDD"
              onChangeText={props.handleChange('startDate')}
            />
            {/* <StyledDTPicker
              label="End Date"
              onPress={showDatePicker}
              iconName="calendar-blank-outline"
              value={endDate ? endDate.toDateString() : ''}
              placeholder="YYYY-MM-DD"
              onChangeText={props.handleChange('endDate')}
            /> */}

            {/* <MyTextInput 
              label="Start Date"
              icon="calendar-blank-outline"
              placeholder="YYYY-MM-DD"
              onChangeText={props.handleChange('startDate')}
              value={startDate ? startDate.toDateString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
            /> */}

            {/* <MyTextInput 
              label="End Date"
              icon="calendar-blank-outline"
              placeholder="YYYY-MM-DD"
              onChangeText={props.handleChange('endDate')}
              value={endDate ? endDate.toDateString() : ''}
              isDate={true}
              editable={false}
              showDatePicker={showDatePicker}
            /> */}

            {/* <StyledButton onPress={props.handleSubmit}>
              <Text style={globalStyles.buttonText}>Add New Trip</Text>
            </StyledButton> */}
            <BlueButton
              onPress={props.handleSubmit}
              buttonText="Add New Trip"
            />
          </View>
        )}
      </Formik>
    </View>
  );
  
};