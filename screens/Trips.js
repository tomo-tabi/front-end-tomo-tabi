import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity, SectionList } from 'react-native';
import { globalStyles, colors, AddButtonSqr, StyledModal, BlueButton, EditButton, YesOrNoCard, Seperator } from "../styles/globalStyles";
const { primary, yellow, grey } = colors

import { AuthContext } from '../context/AuthContext';
import { TripContext } from '../context/TripContext';
import { InviteContext } from '../context/InviteContext';

import moment from 'moment';

import Dialog from "react-native-dialog";//New

import AddTrip from './AddTrip';
import EditTrip from './EditTrip';
import { EventContext } from '../context/EventContext';
import { VoteContext } from '../context/VoteContext';

// import { enableExpoCliLogging } from 'expo/build/logs/Logs';

export default function Trips({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { trips, getUsersInTrip } = useContext(TripContext);
  const { getTripVotes } = useContext(VoteContext);
  const { invites, rejectInvites, acceptInvites } = useContext(InviteContext)
  const { getTripEvents } = useContext(EventContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [tripEditData, setTripEditData] = useState({}) // Set the trip I want to send to Edit Trip component
  const [visible, setVisible] = useState(true);

  const [upcoming, setUpcoming] = useState(true); // default to upcoming trips
  const [filteredTrip, setFilteredTrip] = useState(false); 

  // console.log(invites, trips);

  const pressHandler = (item) => {
    getTripEvents(item.id);
    getUsersInTrip(item.id);
    getTripVotes(item.id);

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

  useEffect(() => {
    // console.log("in",invites);
    if (invites) {
      setInviteStatus(true);
    } else {
      setInviteStatus(false);
    }
  }, [invites])

  useEffect(() => {
    if (trips && upcoming) {
      handelFilter('upcoming',  moment(new Date()).format('YYYY-MM-DD'));
    } else {
      handelFilter('past',  moment(new Date()).format('YYYY-MM-DD'));
    }
    
  },[trips])

  const handelFilter = (state, todayDate) => {
    //console.log('2022-12-21'<'2023-02-01');
    if (trips) {
      const filterArr = trips.filter((item) => {
        if (state === 'upcoming') {
          return item.start_date >= todayDate;
        } else {
          return item.start_date <= todayDate;
        }
      })
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
      <View style={{ paddingTop:15, flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={globalStyles.header}>
          {inviteStatus ?
            "Pending Invites"
            : "No Invites"
          }
        </Text>
        <BlueButton
          onPress={() => logout()}
          buttonText="Logout"
          style={{width: 90, padding:8, marginBottom:10}}
        />
      </View>

      {inviteStatus !== false ?
        <View style={styles.inviteView}>
          <FlatList
            keyExtractor={(item) => {
              // console.log(item.id);
              return item.id
            }}
            data={invites}
            renderItem={({ item }) => (
              <YesOrNoCard
                propmt={
                  <View style={{paddingHorizontal: 5}}>
                    <Text style={styles.inviteText}>User '{item.username}' has invited you trip:</Text>
                    <Text style={styles.inviteTripName}>{item.name}</Text>
                  </View>
                }
                yesFunc={() => acceptInvites(item.id)}
                noFunc={() => rejectInvites(item.id)}
              />
            )}
          />
        </View>
        : ""
      }

      <View style={{ paddingTop:15, flexDirection:'row', justifyContent:'space-between'}}>
        <View style={{flexDirection:'row'}}>
          <Text style={globalStyles.header}>Trips </Text>
          <AddButtonSqr
            setModalOpen={setModalOpen}
            style={{ height:undefined, padding:1, marginBottom:10 }}
          />
        </View>

        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TouchableOpacity 
            onPress={() => {
              setUpcoming(true);
              handelFilter('upcoming', moment(new Date()).format('YYYY-MM-DD'))
            }}
            style={[styles.filterBtn, {borderTopRightRadius:0, borderBottomRightRadius:0, borderRightWidth:0, borderColor: upcoming ? yellow : primary, backgroundColor: upcoming ? yellow : primary}]}
          >
            <Text style={[styles.filterInput, {color: upcoming ? primary : '#9E9E9E'}]}>Upcoming</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setUpcoming(false);
              handelFilter('past', moment(new Date()).format('YYYY-MM-DD'))
            }}
            style={[styles.filterBtn, {borderTopLeftRadius:0, borderBottomLeftRadius:0, borderColor: upcoming ? primary : yellow, backgroundColor: upcoming ? primary : yellow}]}
          >
            <Text style={[styles.filterInput, {color: upcoming ? '#9E9E9E' : primary}]}>Past</Text>
          </TouchableOpacity>
        </View>
      </View>

      

      <View style={styles.tripView}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={filteredTrip}
          // numColumns={2}
          // columnWrapperStyle={styles.row}
          ItemSeparatorComponent={<Seperator/>}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => pressHandler(item)} style={styles.item}>
              <View style={styles.tripInnerView}>
                <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                  <Text style={styles.tripName}>{item.name} </Text>
                  <EditButton
                    setModalOpen={setModalEditOpen}
                    setEditData={setTripEditData}
                    editData={item}
                  />
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
              <Dialog.Button label="OK" style={styles.dialogButton} onPress={hideDialog}/>
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
  tripView: {
    flex: 2,
    shadowColor: 'grey',
    shadowOpacity: 0.8,
    elevation: 7,

    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: primary
  },
  tripInnerView: {//inside each trip file
    flex: 1,
    padding:10
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
  },
  inviteView: {
    marginBottom: 10,
  },
  inviteTripName: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 24,
    textAlign:'center',
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
    borderWidth:1,
    paddingHorizontal:7,
    paddingVertical:2,
    // margin:5,
    // textAlignVertical:'center'
  },
  filterInput:{
    fontSize:17,
    // fontWeight:'bold'

  },
})