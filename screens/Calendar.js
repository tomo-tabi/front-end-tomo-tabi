import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { StyledModal, AddButton, globalStyles, colors } from "../styles/globalStyles";
const { yellow } = colors
const darkYellow = '#fcc256'

import { TripContext } from '../context/TripContext';
import { EventContext } from "../context/EventContext";

import moment from 'moment';

import AddTimeline from './AddTimeline';

export default function CalendarView(params) {
    const { trips } = useContext(TripContext)
    const { tripid, tripEvents, getTripEvents  } = useContext(EventContext);
    // const { tripEvents, getTripEvents, tripid, trips } = useContext(InfoContext)

    const flatlistRef = useRef()

    const [modalOpen, setModalOpen] = useState(false);
    const [info, setInfo] = useState();
    const [selectedDateCalendar, setSelectedDateCalendar] = useState(false);
    const [dateSortEvents, setDateSortEvents] = useState({})
    //fetch one trip detail with trip id 

    useEffect(() => {
        setDateSortEvents({});// don't know if I need it, will look into later
        getTripEvents(tripid);
    }, [tripid])

    useEffect(() => {
        if (tripEvents !== null) {
            // setDateSortEvents({});
            const Obj = {}
            tripEvents.map((item) => {
                let date = moment(item.event_date).format("dddd, MMM DD, YYYY");
                let time = moment(item.event_date).format("HH:mm A");

                if (item.trip_id !== tripid) {
                    return
                }

                const dateObj = {
                    trip_id: item.trip_id,
                    event_name: item.event_name,
                    time: time,
                    id: item.id
                }

                if (Obj[date]) {
                    let exists = Obj[date].find((eventItem) => {
                        return eventItem.id === item.id
                    })

                    if (exists) {
                        return
                    } else {
                        Obj[date].push(dateObj)
                    }

                } else {
                    Obj[date] = [dateObj]
                }
            })

            // console.log("🦴", JSON.stringify(Obj));
            //convert into array
            

            if (Object.keys(Obj).length !== 0) {
                
                const res = Object.keys(Obj).map((key) => ({
                    id: Obj[key][0]["id"],
                    date: key,
                    info: Obj[key]
                }));
                // console.log("🍏", JSON.stringify(res));

                setDateSortEvents(res)
            }
        }

    }, [tripEvents])

    const dateFormat = (date) => {
        return moment(date).format("YYYY-MM-DD");
    }


    const renderItem = ({ item }) => {
        // console.log("it",item);
        let eventArr = item.info;
        return (
            <>
                <Text style={styles.date}>{item.date}</Text>
                {eventArr.map((eventObj) => {
                    return (
                        <View key={eventObj.id} style={styles.dayContainer}>
                            <Text style={styles.dayTime}>{eventObj.time}</Text>
                            <Text style={styles.dayEvent}>{eventObj.event_name}</Text>
                        </View>
                    )
                })}
            </>
        )
    }


    const formatEventsOnCalendar = (tripEvents) => {
        const eventsObject = {}
        let counter = 0
        let startDateTrip, lastDateTrip
        // console.log(tripEvents);
        if(tripEvents !== null){
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
        if(Array.isArray(dateSortEvents)) {

            const dayEvent = dateSortEvents.find((item) => dateFormat(item.date) === dateFormat(day));
            // console.log(dayEvent);
            if(dayEvent){
    
                setInfo([dayEvent])
            }
        }
    }

     //get trip info(id, name, duration)
    function getID(arr) {
      return arr.id === tripid;
    }
    const getTripInfo = trips.find(getID);
    const startDate = new Date(getTripInfo.start_date);
    // console.log(startDate);

    return (
        <>
            <Calendar
                // Initially visible month. Default = now
                initialDate={`${startDate}`}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {checkDate(day.dateString)}}
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
                {/* info has to render as a flat list */}
                {Array.isArray(info) ? 
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={info}
                    renderItem={renderItem}
                />
                :""
                }
                    {/* {info} */}
                    <StyledModal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        AddComponent={AddTimeline}
                    />
                    <AddButton
                        setModalOpen={setModalOpen}
                    />
            </View>
        </>
    )
};


const styles = StyleSheet.create({
    date: {
        fontWeight: "bold",
        fontSize: 24,
        padding: 20,
        marginTop: 10,
        borderRadius: 6,
        backgroundColor: '#9CCAEC'
    },
    dayContainer: {
        marginTop: 7,
        marginLeft: 7
    },

    dayTime: {
        fontSize: 7,
    },

    dayEvent: {
        fontSize: 24,
        paddingLeft: 24,
        paddingBottom: 10,
    },
})
