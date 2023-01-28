import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { StyledModal, globalStyles, colors, EditButton, AddButtonSqr } from "../styles/globalStyles";
const { primary, yellow, blue } = colors
const darkYellow = '#fcc256'

import { TripContext } from '../context/TripContext';
import { EventContext } from "../context/EventContext";

import moment from 'moment';

import AddTimeline from './AddTimeline';
import EditTimeline from './EditTimeline';

import Timeline from 'react-native-timeline-flatlist'

export default function CalendarView(params) {
    const { trips } = useContext(TripContext)
    const { tripid, tripEvents, getTripEvents } = useContext(EventContext);

    const [modalOpen, setModalOpen] = useState(false);

    const [modalEditOpen, setModalEditOpen] = useState(false)
    const [eventEditData, setEventEditData] = useState({}) // Set the event I want to send to Edit Timeline component

    const [dayViewData, setDayViewData] = useState([])
    const [dayViewDate, setDayViewDate] = useState()

    //get trip info(id, name, duration)
    function getID(arr) {
        return arr.id === tripid;
    }
    const getTripInfo = trips.find(getID);
    const startDate = new Date(getTripInfo.start_date);
    // console.log(trips);
    
    const dateFormat = (date) => {
        return moment(date).format("YYYY-MM-DD");
    }

    useEffect(() => {
        getTripEvents(tripid);
        setDayViewDate(startDate);
    }, [tripid]);

    useEffect(() => {
        
        if (tripEvents !== null) {
            let startEvent = tripEvents.filter((event) => {
                return dateFormat(event.event_date) === dateFormat(dayViewDate)
            })
            // console.log(startEvent);
            if (startEvent.length !== 0) {
                setDayViewData(startEvent);
            }
        }

    }, [tripEvents]);

    const renderTime = (rowData) => {
        return (
          <View >
            <Text style={{borderRadius:20, backgroundColor:yellow, padding:5, paddingHorizontal:5, fontSize:12}}>
              {moment(rowData.event_date).format("HH:mm A")}
            </Text>
          </View>
        )
    };
      
    const renderDetail = (rowData) => {
        // console.log("rowdata",rowData);
    
        const editData = {
            "date": rowData.event_date,
            "event_name": rowData.event_name,
            "event_id": rowData.id,
            "description": rowData.description
        }

        let title = (
            <View style={{
                flex:1, 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignContent:'center', 
                backgroundColor:primary, 
                borderRadius: 10,
                padding:10,
                marginTop:-10
            }}>
            <Text style={{textAlignVertical:'center', fontWeight:'bold', fontSize:17}}>
                {rowData.event_name} 
            </Text>
            <EditButton
                setModalOpen={setModalEditOpen}
                setEditData={setEventEditData}
                editData={editData}
            />
            </View>
        )

        return (
            <View style={{flex:1}}>
                {title}
            </View>
        )
    };


    const formatEventsOnCalendar = (tripEvents) => {
        const eventsObject = {}
        let counter = 0
        let startDateTrip, lastDateTrip
        // console.log(tripEvents);
        if (tripEvents !== null) {
            tripEvents.forEach(event => {
                eventsObject[dateFormat(event.event_date)] = { color: yellow, textColor: 'white', marked: true, dotColor: 'white' }
            })
        }

        trips.forEach((trip) => {
            if (trip.id === tripid) {
                startDateTrip = dateFormat(trip.start_date)
                lastDateTrip = dateFormat(trip.end_date)
            }
        })
        var getDaysArray = function (start, end) {
            for (var arr = [], dt = moment(start); dt <= moment(end); dt = moment(dt).add(1, 'days')) {
                arr.push(moment(dt));
            }
            return arr;
        };
        var daylist = getDaysArray(dateFormat(startDateTrip), dateFormat(lastDateTrip));
        daylist.map((v) => v.toISOString().slice(0, 10)).join("")
        daylist.map((date) => {
            if (eventsObject[dateFormat(lastDateTrip)]) {
                eventsObject[dateFormat(lastDateTrip)] = { endingDay: true, color: darkYellow, textColor: 'white', marked: true, dotColor: 'white' }

            }
            if (eventsObject[dateFormat(startDateTrip)] && counter == 0) {
                eventsObject[dateFormat(startDateTrip)] = { startingDay: true, color: darkYellow, textColor: 'white', marked: true, dotColor: 'white' }
                counter += 1
            }
            if (!eventsObject[dateFormat(date)]) {
                eventsObject[dateFormat(date)] = { color: yellow, textColor: 'white' }
                if (dateFormat(date) == dateFormat(lastDateTrip)) {
                    eventsObject[dateFormat(lastDateTrip)] = { endingDay: true, color: darkYellow, textColor: 'white' }
                }
                if (dateFormat(date) == dateFormat(startDateTrip)) {
                    eventsObject[dateFormat(startDateTrip)] = { startingDay: true, color: darkYellow, textColor: 'white' }
                    counter += 1
                }
            }
        })

        return eventsObject
    }

    const checkDate = (day) => {
        // console.log("dateSortEvents", dateSortEvents)
        if (tripEvents !== null) {
            const currentEventArr = tripEvents.filter((item) => {
                return dateFormat(day) === dateFormat(item.event_date)
              });
        
            const eventArrFormat = currentEventArr.map((item) => {
            return {
                event_date: item.event_date,
                event_name: item.event_name,
                    description: item.description,
                    id: item.id
                }
            });
            // console.log("eventArrFormat",eventArrFormat);

            setDayViewDate(new Date(day));
            if(eventArrFormat && eventArrFormat.length !== 0 ) {
                setDayViewData(eventArrFormat);
            } else {
                setDayViewData([]);
            }
        }
    }


    return (
        <>
            <StyledModal
                modalOpen={modalEditOpen}
                setModalOpen={setModalEditOpen}
                AddComponent={EditTimeline}
                EditData={eventEditData}
            />
            <Calendar
                // Initially visible month. Default = now
                initialDate={`${startDate}`}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => { checkDate(day.dateString) }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'MMMM, yyyy'}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={true}
                // Show week numbers to the left. Default = false
                showWeekNumbers={false}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
                // Replace default month and year title with custom one. the function receive a date as parameter
                // renderHeader={date => {
                //     /*Return JSX*/
                // }}

                markingType={'period'}
                markedDates={formatEventsOnCalendar(tripEvents)}

            />
            <View style={globalStyles.container}>
                <View style={styles.date}>
                    <Text style={styles.dateText}>{moment(dayViewDate).format("dddd, MMM DD")}</Text>
                    <AddButtonSqr
                        setModalOpen={setModalOpen}
                        style={{ height:undefined, margin:0, padding:1, backgroundColor:yellow }}
                    />
                </View>
                {dayViewData ?
                    <Timeline
                        style={styles.container}
                        data={dayViewData}
                        renderDetail={renderDetail}
                        renderTime={renderTime}
                        circleSize={20}
                        circleColor={blue}
                        lineColor={blue}
                        options={{
                            style: { paddingTop: 5  }
                        }}
                        innerCircle={'dot'}
                        separator={false}
                        isUsingFlatlist={true}
                    />
                    :''
                }
                <StyledModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    AddComponent={AddTimeline}
                />
                
            </View>
        </>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    date: {
        marginBottom:5,
        flexDirection:'row',
        justifyContent:"space-between",
    },
    dateText:{
        flex:1,
        padding: 5,
        borderRadius: 6,
        backgroundColor: '#9CCAEC',
        fontWeight: "bold",
        fontSize: 20,
        textAlignVertical:'center',
        marginRight:5,
        marginVertical:3,
    },
})
