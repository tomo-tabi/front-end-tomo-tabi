import React, { useState, useContext, useEffect  } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity, SectionList } from 'react-native';
import { globalStyles, colors, AddButton, StyledModal, BlueButton, YellowButton } from "../styles/globalStyles";
const { primary, blue, yellow } = colors

import { AuthContext } from '../context/AuthContext';
import { TripContext } from '../context/TripContext';
import { InviteContext } from '../context/InviteContext';

import moment from 'moment';

import AddTrip from './AddTrip';

// import { enableExpoCliLogging } from 'expo/build/logs/Logs';

export default function Trips({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { trips } = useContext(TripContext);
  const { invites, rejectInvites, acceptInvites } = useContext(InviteContext)
  
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ inviteStatus, setInviteStatus ] = useState(false);

  // console.log(invites, trips);

  const pressHandler = (item) => {
    navigation.navigate('TripTabNav', {
      screen: 'TimeLine',
      // need to wrap it in obj to pass to nested nav
      params: { id: item.id, name: item.name },
    })
  }
  // console.log(trips);

  const dateFormat = (startDate, endDate) => {
    return `${moment(startDate).format("MMM, Do")} ➡︎ ${moment(endDate).format("MMM Do, YYYY")}` 
  }

  useEffect(() => {
    // console.log("in",invites);
    if(invites){
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
      <Text style={globalStyles.header}>
        {inviteStatus ?
        "Pending Invites" 
        :"No Invites"
        }
      </Text>

      {inviteStatus !== false ?
        <View style={styles.inviteView}>
          <FlatList
            keyExtractor={(item) => {
              // console.log(item.id);
              return item.id
            }}
            data={invites}
            renderItem={({ item }) => (
              <View style={styles.inviteTripCard}>
                
                <View style={styles.inviteTripInfo}>
                  <Text style={styles.inviteText}>User '{item.username}' has invited you trip:</Text>
                  <Text style={styles.inviteTripName}>{item.name}</Text>
                </View>

                <View style={styles.inviteBtnView}>
                  <YellowButton 
                      onPress = {() => acceptInvites(item.id)}
                      iconName='check'
                  />
                  <YellowButton 
                    onPress = {() => rejectInvites(item.id)}
                    iconName='window-close'
                  />
                </View>
              </View>
            )}
          /> 
        </View>
        : ""
      }
      <Text style={globalStyles.header}>Trips</Text>

      <View style={styles.tripView}>
        <FlatList
          keyExtractor={( item ) => item.id}
          data={trips}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => pressHandler(item)} style={styles.item}>
                <View style={styles.tripInnerView}>
                  <Text style={styles.tripName}>{item.name}</Text>
                  <Text style={styles.tripDate}>{dateFormat(item.start_date, item.end_date)}</Text>
                </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <BlueButton
        onPress={() => logout()}
        buttonText="Logout"
      />

      <AddButton
        setModalOpen={setModalOpen}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  row:{ //each row of flat list
    justifyContent:'space-between',
  },
  item: { // each trip file wrapper
    backgroundColor: blue,
    // flex:1,

    padding: 5,
    marginBottom:5,
    height: 100,
    width:179,
    borderRadius:6,
    alignItems:'flex-start',
    
    // shadowColor: 'black',
    // shadowOpacity: 0.8,
    // elevation: 3,
  },
  tripView:{
    flex:2,
    shadowColor: 'grey',
    shadowOpacity: 0.8,
    elevation: 7,
    
    padding: 5,
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    backgroundColor:primary
  },
  tripInnerView:{//inside each trip file
    flex:1,
  },
  tripName:{
    alignItems:'center',
    fontWeight: "bold",
    fontSize: 24,
    paddingHorizontal: 5,
  },
  tripDate:{
    fontSize: 16,
    paddingHorizontal: 5,
    paddingTop:5,
  },
  inviteText:{
    fontSize: 16,
  },
  inviteView:{
    // flex:1,
    marginBottom:10,
    // paddingHorizontal:10,    
    // padding:10,
    // backgroundColor: primary,
    // borderRadius:6,
    
  },
  inviteTripCard:{
    flex:1,
    margin:5,
    // padding:5,
    // borderBottomWidth:1,
    borderRadius: 6,
    overflow:'hidden',
    // backgroundColor: "black"
    shadowColor: 'grey',
    shadowOpacity: 0.8,
    elevation: 7,
  },
  inviteTripInfo:{
    // flex:1,
    padding:5,
    // borderRadius: 6,
    backgroundColor: blue
  },
  inviteTripName: {
    flex:1,
    // width: 300,
    fontWeight: "bold",
    fontSize: 24,
    // padding: 20,
    // marginHorizontal: 10,
    // borderRadius: 6,
    // backgroundColor: blue
  },
  inviteBtnView:{
    flex:1,
    flexDirection:'row',
    backgroundColor: yellow,
    // borderWidth:1,
    // borderColor:'black'
  }
})