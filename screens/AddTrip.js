import React, { useState, useContext } from 'react';
import { View, Keyboard } from 'react-native';
import { Formik } from 'formik';
import { StyledDTPicker, MyTextInput, BlueButton } from "../styles/globalStyles";
import DatePicker from 'react-native-neat-date-picker'
import { TripContext } from '../context/TripContext';
import moment from 'moment';

export default function AddTrip({setModalOpen}) {
  const { postTrip, getTrips } = useContext(TripContext);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const showDatePicker = () => {
    setShow(true);
    Keyboard.dismiss();
  };

  const onCancel = () => {
    setShow(false);
  }

  const onConfirm = (output) => {
    setShow(false);
    const { startDate, startDateString, endDate, endDateString } = output;
    setStartDate(startDate);
    setEndDate(endDate);
    console.log(startDateString, endDateString);
  }

  return(
    <View style={{paddingHorizontal: 10,paddingTop:10,}}>
      {show && (
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