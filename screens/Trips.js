import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity, SectionList } from 'react-native';
import { globalStyles, colors, AddButton, StyledModal, BlueButton, EditButton, YesOrNoCard, Seperator } from "../styles/globalStyles";
const { primary } = colors

import { AuthContext } from '../context/AuthContext';
import { TripContext } from '../context/TripContext';
import { InviteContext } from '../context/InviteContext';

import moment from 'moment';

import { Ionicons } from '@expo/vector-icons';
import Dialog from "react-native-dialog";//New

import AddTrip from './AddTrip';
import EditTrip from './EditTrip';
import { EventContext } from '../context/EventContext';

// import { enableExpoCliLogging } from 'expo/build/logs/Logs';

export default function Trips({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { trips } = useContext(TripContext);
  const { invites, rejectInvites, acceptInvites } = useContext(InviteContext)
  const { getTripEvents } = useContext(EventContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [tripEditData, setTripEditData] = useState({}) // Set the trip I want to send to Edit Trip component
  const [visible, setVisible] = useState(true);

  // console.log(invites, trips);

  const pressHandler = (item) => {
    getTripEvents(item.id);

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
      <Text style={globalStyles.header}>Trips </Text>

      <View style={styles.tripView}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={trips}
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
                  {/* <Ionicons
                    name="ellipsis-horizontal-sharp"
                    style={{ position: 'absolute', right: 0 }}
                    size={24} color="black"
                    onPress={() => { handleEdit(item) }} /> */}
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

      <AddButton
        setModalOpen={setModalOpen}
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

    // padding: 5,
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
})