import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, FlatList, View, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors, AddButtonSqr, StyledModal, BlueButton, EditButton, YesOrNoCard, Seperator, StatusColor } from "../styles/globalStyles";
const { primary, yellow } = colors

import { AuthContext } from '../context/AuthContext';
import { TripContext } from '../context/TripContext';
import { InviteContext } from '../context/InviteContext';
import { EventContext } from '../context/EventContext';
import { VoteContext } from '../context/VoteContext';

import moment from 'moment';
import Dialog from "react-native-dialog";

import AddTrip from './AddTrip';
import EditTrip from './EditTrip';

export default function Trips({ navigation }) {
  const { userData } = useContext(AuthContext);
  const { trips, getUsersInTrip, checkPermission, checkOwner, owner } = useContext(TripContext);
  const { getTripVotes, getUserTripVotes } = useContext(VoteContext);
  const { getInvites, getInvitesSent, invites, rejectInvites, acceptInvites } = useContext(InviteContext);
  const { getTripEvents } = useContext(EventContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false);
  const [tripEditData, setTripEditData] = useState({}) // Set the trip I want to send to Edit Trip component
  const [visible, setVisible] = useState(true);

  const [upcoming, setUpcoming] = useState(true); // default to upcoming trips
  const [filteredTrip, setFilteredTrip] = useState(false);

  const [ongoingTrips, setOngoingTrips] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getInvites();
    }, [])
  );

  // console.log(invites, trips);

  const pressHandler = (item) => {
    getTripEvents(item.id);
    getUsersInTrip(item.id);
    getTripVotes(item.id);
    getUserTripVotes(item.id);
    checkPermission(item.id);
    checkOwner(item.id);
    getInvitesSent(item.id);

    navigation.navigate('TripTabNav', {
      screen: 'TimeLine',
      // need to wrap it in obj to pass to nested nav
      params: { name: item.name },
    })
  }

  // console.log(trips);

  const dateFormat = (startDate, endDate) => {
    return `${moment(startDate).format("Do MMM")} – ${moment(endDate).format("Do MMM YYYY")}`
  }

  // handle pop up message
  const hideDialog = () => {
    setVisible(false);
  };

  const compare = ( a, b ) =>  {
    if ( a.start_date < b.start_date ){
      return 1;
    }
    if ( a.start_date > b.start_date ){
      return -1;
    }
    return 0;
  }
  
  useEffect(() => {
    // console.log("in",invites);
    if (!invites) {
      setInviteOpen(false);
    }
  }, [invites])

  useEffect(() => {
    if (trips && upcoming) {
      handelFilter('upcoming', moment(new Date()).format('YYYY-MM-DD'));
    } else {
      handelFilter('past', moment(new Date()).format('YYYY-MM-DD'));
    }

  }, [trips])

  useEffect(() => {
    if (trips) {
      const filterArr = trips.filter((item) => {
        return (item.start_date <= moment(new Date()).format('YYYY-MM-DD') && item.end_date >= moment(new Date()).format('YYYY-MM-DD'));
      })
      filterArr.map((trip) => {
        if (userData.username === trip.owner_username) {
          trip.owner = true
        }
        else {
          trip.owner = false
        }
      });

      setOngoingTrips(filterArr);
    }
  }, [trips])

  const handelFilter = (state, todayDate) => {
    //console.log('2022-12-21'<'2023-02-01');
    if (trips) {
      const filterArr = trips.filter((item, i) => {
        if (state === 'upcoming') {
          return (item.start_date >= todayDate);
        } else {
          return (item.start_date <= todayDate && item.end_date <= todayDate);
        }
      })
      filterArr.map((trip) => {
        if (userData.username === trip.owner_username) {
          trip.owner = true
        }
        else {
          trip.owner = false
        }
      });

      if (state !== 'upcoming'){
        filterArr.sort( compare );
        console.log("test")
      }

      setFilteredTrip(filterArr);
    }
    // console.log(filterArr);
    // console.log(state, todayDate);
  }

  return (
    <View style={globalStyles.container}>
      <StyledModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        AddComponent={AddTrip}
      />
      
      {invites &&
        <TouchableOpacity style={[globalStyles.card, {flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:StatusBar.currentHeight}]} onPress={() => setInviteOpen(!inviteOpen)} >
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={[globalStyles.header, {marginRight:5, paddingVertical:0}]}>
              Pending Invites
            </Text>
            {(!inviteOpen && invites) && 
              <Text style={[globalStyles.header, {textAlign:'center', textAlignVertical:'center', borderRadius:25, borderWidth:2, paddingVertical:0, paddingHorizontal:8, borderColor:StatusColor.rejected, color:StatusColor.rejected, marginBottom:0}]}>
                {invites.length}
              </Text>
            }
          </View>
          <MaterialCommunityIcons name={inviteOpen ? 'chevron-up' : 'chevron-down'} size={30}/>
        </TouchableOpacity>
      }
      {inviteOpen &&
        <View style={[styles.inviteView, {flex: (invites && invites.length >= 2) ? 1.5 : 0 }]}>
          <FlatList
            keyExtractor={(item) => item.id}
            data={invites}
            ItemSeparatorComponent={<Seperator />}
            renderItem={({ item }) => (
              <YesOrNoCard
                propmt={
                  <View style={{ paddingHorizontal: 5, flexDirection:'row', flexWrap:'wrap' }}>
                    <Text style={styles.inviteText}>User '{item.username}' has invited you trip:</Text>
                    <Text style={styles.inviteTripName}> {item.name}</Text>
                </View>}
                yesFunc={() => acceptInvites(item.id)}
                noFunc={() => rejectInvites(item.id)}
                style={{ elevation:0, marginBottom:0, borderRadius:0 }}
              />
          )}
        />
        </View>
      }

      {ongoingTrips &&
        <View>
          <Text style={[globalStyles.header, {marginTop: invites ? 0 : StatusBar.currentHeight, paddingTop:0}]} >Ongoing trips</Text>
          <View style={styles.ongoingTripView}>
            <FlatList
              keyExtractor={(item) => item.id}
              data={ongoingTrips}
              // numColumns={2}
              // columnWrapperStyle={styles.row}
              ItemSeparatorComponent={<Seperator />}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => pressHandler(item)} style={styles.item}>
                  <View style={styles.tripInnerView}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.tripName}>{item.name} </Text>
                      {item.is_locked ?
                        item.owner ?
                          <EditButton
                            setModalOpen={setModalEditOpen}
                            setEditData={setTripEditData}
                            editData={item}
                          />
                          :
                          null : <EditButton
                          setModalOpen={setModalEditOpen}
                          setEditData={setTripEditData}
                          editData={item}
                        />}
                    </View>
                    <Text style={styles.tripDate}>{dateFormat(item.start_date, item.end_date)}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>}


      <View style={{ paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={globalStyles.header}>Trips </Text>
          <AddButtonSqr
            setModalOpen={setModalOpen}
            style={{ height: undefined, padding: 1, marginBottom: 10 }}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              setUpcoming(true);
              handelFilter('upcoming', moment(new Date()).format('YYYY-MM-DD'))
            }}
            style={[styles.filterBtn, { borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0, borderColor: upcoming ? yellow : primary, backgroundColor: upcoming ? yellow : primary }]}
          >
            <Text style={[styles.filterInput, { color: upcoming ? primary : '#9E9E9E' }]}>Upcoming</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setUpcoming(false);
              handelFilter('past', moment(new Date()).format('YYYY-MM-DD'))
            }}
            style={[styles.filterBtn, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderColor: upcoming ? primary : yellow, backgroundColor: upcoming ? primary : yellow }]}
          >
            <Text style={[styles.filterInput, { color: upcoming ? '#9E9E9E' : primary }]}>Past</Text>
          </TouchableOpacity>
        </View>
      </View>



      <View style={styles.tripView}>
        {filteredTrip.length === 0 &&
          (upcoming ?
            <Text style={[styles.tripDate, { fontSize: 24, textAlign: 'center', marginTop: 20 }]}>No Upcoming Trips</Text>
            : <Text style={[styles.tripDate, { fontSize: 24, textAlign: 'center', marginTop: 20 }]}>No Past Trips</Text>)
        }
        <FlatList
          keyExtractor={(item) => item.id}
          data={filteredTrip}
          // numColumns={2}
          // columnWrapperStyle={styles.row}
          ItemSeparatorComponent={<Seperator />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => pressHandler(item)}>
              <View style={styles.tripInnerView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.tripName}>{item.name} </Text>
                  {item.is_locked ?
                    item.owner ?
                      <EditButton
                        setModalOpen={setModalEditOpen}
                        setEditData={setTripEditData}
                        editData={item}
                      />
                      :
                      null : <EditButton
                      setModalOpen={setModalEditOpen}
                      setEditData={setTripEditData}
                      editData={item}
                    />}
                </View>
                <Text style={styles.tripDate}>{dateFormat(item.start_date, item.end_date)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {trips === null &&
          <View>
            <Dialog.Container visible={visible}>
              <Dialog.Title style={styles.dialogTitle}>There is no trip now!</Dialog.Title>
              <Dialog.Description style={styles.dialogDescription}>
                Plan a new trip and have fun!
              </Dialog.Description>
              <Dialog.Button label="OK" style={styles.dialogButton} onPress={hideDialog} />
            </Dialog.Container>
          </View>
        }
      </View>

      <StyledModal
        modalOpen={modalEditOpen}
        setModalOpen={setModalEditOpen}
        AddComponent={EditTrip}
        EditData={tripEditData}
      />

    </View>
  )
};

const styles = StyleSheet.create({
  row: { //each row of flat list
    justifyContent: 'space-between',
  },
  ongoingTripView:{
    marginBottom: 10,
    shadowColor: 'grey',
    shadowOpacity: 0.8,
    elevation: 7,
    borderRadius: 6,
    backgroundColor: primary
  },
  tripView: {
    flex: 2,
    marginBottom: 10,
    shadowColor: 'grey',
    shadowOpacity: 0.8,
    elevation: 7,

    borderRadius: 6,
    // borderTopLeftRadius: 6,
    // borderTopRightRadius: 6,
    backgroundColor: primary
  },
  tripInnerView: {//inside each trip file
    flex: 1,
    padding: 10
  },
  tripName: {
    alignItems: 'center',
    fontWeight: "bold",
    fontSize: 24,
    paddingHorizontal: 5,
  },
  tripDate: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingTop: 5,
    color: '#9e9e9e'
  },
  inviteText: {
    fontSize: 16,
    textAlignVertical:'center',
  },
  inviteView: {
    borderRadius:6,
    overflow:'hidden',
  },
  inviteTripName: {
    fontWeight: "bold",
    fontSize: 24,
  },
  dialogTitle: {
    fontSize: 25,
    color: "darkcyan"
  },
  dialogDescription: {
    fontWeight: 'bold',
    color: 'goldenrod'
  },
  dialogButton: {
    fontWeight: 'bold'
  },
  filterBtn: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    // margin:5,
    // textAlignVertical:'center'
  },
  filterInput: {
    fontSize: 17,
    // fontWeight:'bold'

  },
})