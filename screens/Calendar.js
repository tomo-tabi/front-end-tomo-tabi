import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { StyledModal, AddButton, globalStyles, colors, EditButton } from "../styles/globalStyles";
const { yellow } = colors
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

    const setDayData = (date, events) => {
        const eventArr = []
        events.forEach((event) => {
            const eventObject = {}
            const objToSendToEdit = {}
            objToSendToEdit["date"] = moment(date + " " + event["time"], "dddd, MMMM Do YYYY HH:mm A")
            objToSendToEdit["event_name"] = event["event_name"]
            objToSendToEdit["event_id"] = event["id"]
            objToSendToEdit["description"] = event["description"]

            eventObject["time"] = <Text> {event["time"]} </Text>
            eventObject["title"] = (
                //The width is set up by number. I really dont like this, but I dont know how to do it to make it look good
                <View style={{ width: 261, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{event["event_name"]} </Text>
                    <EditButton
                        setModalOpen={setModalEditOpen}
                        setEditData={setEventEditData}
                        editData={objToSendToEdit}
                    />
                </View>)
            eventObject["description"] = <Text> {event["description"] ? event["description"] : "There is no description yet"}</Text>

            eventArr.push(eventObject)
        })

        setDayViewData(eventArr)
    }


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
        if (Array.isArray(dateSortEvents)) {

            const dayEvent = dateSortEvents.find((item) => dateFormat(item.date) === dateFormat(day));
            console.log(dayEvent);
            if (dayEvent) {
                setDayViewDate(dayEvent["date"])
                setDayData(dayEvent["date"], dayEvent["info"])
            }
            else {
                setDayViewDate(moment(day).format("dddd, MMM DD, YYYY"))
                setDayViewData([])
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
                {dayViewDate && <Text style={styles.date}>{dayViewDate}</Text>}
                {dayViewData &&
                    <Timeline
                        style={styles2.list}
                        data={dayViewData}
                        circleSize={20}
                        circleColor='rgb(45,156,219)'
                        lineColor='rgb(45,156,219)'
                        timeContainerStyle={{ minWidth: 52 }}
                        timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
                        descriptionStyle={{ color: 'gray' }}
                        options={{
                            style: { paddingTop: 5 }
                        }}
                        innerCircle={'dot'}
                        separator={false}
                        detailContainerStyle={{ marginBottom: 20, paddingLeft: 5, paddingRight: 5, backgroundColor: "#BBDAFF", borderRadius: 10 }}
                        // columnFormat='two-column'
                        isUsingFlatlist={true}
                    />
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

const styles2 = StyleSheet.create({
    container: {
        flex: 1,

        // height:0,
    },
    list: {
        flex: 1,
        // marginTop: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    }
});


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
