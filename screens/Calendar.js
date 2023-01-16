import React from 'react';



import { StyleSheet, Text, FlatList, View, Modal, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

import AddTimeline from './AddTimeline';


export default function CalendarView(params) {
    const { tripEvents, getTripEvents, tripid, trips } = useContext(InfoContext)


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
                    date: key,
                    info: Obj[key]
                }));
                // console.log("🍏", JSON.stringify(res));

                setDateSortEvents(res)
            }
        }

    }, [tripEvents])


    const renderItem = ({ item }) => {
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
        let startDateTrip
        let lastDateTrip
        tripEvents.forEach(event => {
            eventsObject[moment(event.event_date).format("YYYY-MM-DD")] = { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' }
        })
        trips.forEach((trip) => {
            if (trip.id === tripid) {
                startDateTrip = moment(trip.start_date)
                lastDateTrip = moment(trip.end_date)
            }
        })
        var getDaysArray = function (start, end) {
            for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
                arr.push(new Date(dt));
            }
            return arr;
        };
        var daylist = getDaysArray(new Date(startDateTrip), new Date(lastDateTrip));
        daylist.map((v) => v.toISOString().slice(0, 10)).join("")
        daylist.map((date) => {
            if (eventsObject[moment(lastDateTrip).format("YYYY-MM-DD")]) {
                eventsObject[moment(lastDateTrip).format("YYYY-MM-DD")] = { endingDay: true, color: '#50cebb', textColor: 'white', marked: true, dotColor: 'white' }

            }
            if (eventsObject[moment(startDateTrip).format("YYYY-MM-DD")]) {
                eventsObject[moment(startDateTrip).format("YYYY-MM-DD")] = { startingDay: true, color: '#50cebb', textColor: 'white', marked: true, dotColor: 'white' }
            }
            if (!eventsObject[moment(date).format("YYYY-MM-DD")]) {
                eventsObject[moment(date).format("YYYY-MM-DD")] = { color: '#70d7c7', textColor: 'white' }
                if (moment(date).format("YYYY-MM-DD") == moment(lastDateTrip).format("YYYY-MM-DD")) {
                    eventsObject[moment(lastDateTrip).format("YYYY-MM-DD")] = { endingDay: true, color: '#50cebb', textColor: 'white' }
                }
                if (moment(date).format("YYYY-MM-DD") == moment(startDateTrip).format("YYYY-MM-DD")) {
                    eventsObject[moment(startDateTrip).format("YYYY-MM-DD")] = { startingDay: true, color: '#50cebb', textColor: 'white' }
                }
            }
        })
        return eventsObject
    }

    const checkDate = (day) => {
        console.log("dateSortEvents", dateSortEvents)
        dateSortEvents.forEach(date => {
            if(moment(date.date).format("YYYY-MM-DD") == moment(day).format("YYYY-MM-DD")){
                console.log(date.info)
                let eventArr = date.info
                setInfo(
                    <>
                        <Text style={styles.date}>{date.date}</Text>
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
        });
    }


    return (
        <>
            <Calendar
                // Initially visible month. Default = now
                initialDate={`${moment().format("YYYY-MM-DD")}`}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {checkDate(day.dateString)}}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'MMM yyyy'}
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
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    {info}
                    {/* {Array.isArray(dateSortEvents) &&
                        <FlatList
                            keyExtractor={(item) => item.id}
                            ref={flatlistRef}
                            data={dateSortEvents}
                            renderItem={renderItem}
                        />
                    } */}

                    <Modal visible={modalOpen} animationType="slide">
                        <View style={styles.modalContent}>
                            <MaterialCommunityIcons
                                name='window-close'
                                size={24}
                                style={{ ...styles.modalToggle, ...styles.modalClose }}
                                onPress={() => setModalOpen(false)}
                            />
                            <AddTimeline setModalOpen={setModalOpen} setSelectedDateCalendar={setSelectedDateCalendar} selectedDateCalendar={selectedDateCalendar}/>
                        </View>
                    </Modal>

                    <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name='plus'
                            size={50}
                            style={styles.modalToggle}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
};
