import React, { useState, useContext } from 'react';
import { View, Keyboard } from 'react-native';
import { Formik } from 'formik';
import { MyTextInput, StyledDTPicker, BlueButton } from "../styles/globalStyles";
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-neat-date-picker';
import { TripContext } from '../context/TripContext';
import moment from 'moment';

export default function EditTrip({ setModalOpen, EditData }) {
    const { editTrip, deleteTrip } = useContext(TripContext)

    // for time date picker
    const [showDate, setShowDate] = useState(false);
    // const [showEndDate, setShowEndDate] = useState(false);
    // const [showStartDate, setShowStartDate] = useState(false);
    const [startDate, setStartDate] = useState(EditData["start_date"]);
    const [endDate, setEndDate] = useState(EditData["end_date"]);

    // const onChangeStartDate = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     setShowStartDate(false);
    //     setStartDate(moment(currentDate).format("YYYY-MM-DD"))
    // };
    // const onChangeEndDate = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     setShowEndDate(false);
    //     setEndDate(moment(currentDate).format("YYYY-MM-DD"))
    // };

    // const editTripSubmit = (info) => {
    //     editTrip(info)
    //     setModalOpen(false)
    // }

    const deleteTripSubmit = (info) => {
        deleteTrip(info);
        setModalOpen(false);
    }

    const showDatePicker = () => {
        setShowDate(true);
        Keyboard.dismiss();
    };

    // const showEndDatePicker = () => {
    //     setShowEndDate(true);
    // };

    const onCancel = () => {
        setShowDate(false);
    }
    
    const onConfirm = (output) => {
        setShowDate(false);
        const { startDate, endDate } = output
        setStartDate(startDate);
        setEndDate(endDate);
    }

    return (
        <View>
            <Formik
                initialValues={{
                    startDate: EditData["start_date"],
                    endDate: EditData["end_date"],
                    name: EditData["name"],
                    id: EditData["id"]
                }}
                onSubmit={(values) => {
                    values = {...values, startDate: moment(startDate).format("YYYY-MM-DD"), endDate: moment(endDate).format("YYYY-MM-DD")}
                    editTrip(values);
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
                            label="Start Date"
                            onPress={showDatePicker}
                            iconName="calendar-blank-outline"
                            value={`${moment(startDate).format("YYYY-MM-DD")} - ${moment(endDate).format("YYYY-MM-DD")}`}
                            placeholder="YYYY-MM-DD"
                        />
                        {/* <StyledDTPicker
                            label="End Date"
                            onPress={showEndDatePicker}
                            iconName="calendar-blank-outline"
                            value={endDate}
                            placeholder="YYYY-MM-DD"
                        /> */}

                        {/* <BlueButton
                            onPress={() => { editTripSubmit(props.values) }}
                            buttonText="Submit Edit"
                        /> */}

                        <BlueButton
                            onPress={props.handleSubmit}
                            buttonText="Submit Edit"
                        />

                        <BlueButton
                            onPress={() => deleteTripSubmit(props.values)}
                            buttonText="Delete Trip"
                        />

                        {showDate && (
                            <DatePicker
                            isVisible={showDate}
                            initialDate={new Date(startDate)}
                            mode={'range'}
                            onCancel={onCancel}
                            onConfirm={onConfirm}
                            />
                            // <DateTimePicker
                            //     value={new Date(endDate)}
                            //     mode='date'
                            //     is24Hour={false}
                            //     onChange={(event, selectedDate) => {
                            //         onChangeEndDate(undefined, selectedDate);
                            //         props.setFieldValue('endDate', moment(selectedDate).format("YYYY-MM-DD"))
                            //     }}
                            // />
                        )}
                        {/* {showStartDate && (
                            <DateTimePicker
                                value={new Date(startDate)}
                                mode='date'
                                is24Hour={false}
                                onChange={(event, selectedDate) => {
                                    onChangeStartDate(undefined, selectedDate);
                                    props.setFieldValue('startDate', moment(selectedDate).format("YYYY-MM-DD"))
                                }}
                            />
                        )} */}
                    </View>
                )}
            </Formik>
        </View>

    );

};