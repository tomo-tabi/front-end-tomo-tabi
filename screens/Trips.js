import React, { useState, useContext,  } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { globalStyles, colors, AddButton, StyledButton, StyledModal } from "../styles/globalStyles";
const { blue, lightBlue, grey } = colors

import { AuthContext } from '../context/AuthContext';
import { InfoContext } from '../context/InfoContext';

import moment from 'moment';

import AddTrip from './AddTrip';

// import { enableExpoCliLogging } from 'expo/build/logs/Logs';

export default function Trips({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { trips, invites, rejectInvites, acceptInvites } = useContext(InfoContext);
  const [ modalOpen, setModalOpen ] = useState(false);

  const pressHandler = (item) => {
    navigation.navigate('TripTabNav', {
      screen: 'TimeLine',
      // need to wrap it in obj to pass to nested nav
      params: { id: item.id, name: item.name },
    })
  }
  // console.log(trips);

  const dateFormat = (startDate, endDate) => {
    return `${moment(startDate).format("MMMM, Do")} ➡︎ ${moment(endDate).format("MMMM Do, YYYY")}` 
  }


  return (
    <View style={globalStyles.container}>
      {StyledModal(modalOpen, setModalOpen, AddTrip)}

      {/* <Modal visible={modalOpen} animationType='slide'>
        <View style={StyleSheet.modalContent}>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => setModalOpen(false)}
          />
          <AddTrip setModalOpen={setModalOpen} />
        </View>
      </Modal> */}

      {invites !== "no invites found" ?
        <>
        <Text style={styles.text}>
          Pending Invites
        </Text> 
        <FlatList
          keyExtractor={(item) => {
            console.log(item.id);
            return item.id
          }}
          data={invites}
          renderItem={({ item }) => (
            <TouchableOpacity >
              <Text style={styles.date}>The user {item.username} has invited you to the following trip:</Text>
              <Text style={styles.inviteName}>{item.name} </Text>
              <MaterialCommunityIcons
                name='check-bold'
                size={24}
                style={{ ...styles.icon}}
                onPress={() => acceptInvites(item.id)}
              />
              <MaterialCommunityIcons
                name='window-close'
                size={24}
                style={{ ...styles.icon}}
                onPress={() => rejectInvites(item.id)}
              />
            </TouchableOpacity>
          )}
        /> 
        </>
        : <Text style={styles.text}> No Invites </Text> 
      }

    <FlatList
      keyExtractor={( item ) => item.id}
      data={trips}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => pressHandler(item)} style={styles.item}>
            <View style={styles.view}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>{dateFormat(item.start_date, item.end_date)}</Text>
            </View>
        </TouchableOpacity>
      )}
    />

    <StyledButton onPress={() => logout()}>
      <Text style={globalStyles.buttonText}>Logout</Text>
    </StyledButton>

    <TouchableOpacity onPress={() => setModalOpen(true)} style={globalStyles.addIconButton}>
      <AddButton/>
    </TouchableOpacity>
  </View>
  )
};

const styles = StyleSheet.create({
  row:{
    justifyContent:'space-between',
  },
  item: {
    backgroundColor: blue,
    padding: 5,
    marginBottom:10,
    height: 100,
    width:181,
    borderRadius:6,
    alignItems:'flex-start',
    
    shadowColor: grey,
    shadowOpacity: 0.3,
    elevation: 7,
  },
  view:{
    flex:1,
  },
  name:{
    alignItems:'center',
    fontWeight: "bold",
    fontSize: 24,
    paddingHorizontal: 5,
  },
  date:{
    fontSize: 16,
    paddingHorizontal: 5,
    paddingTop:5,
  },

  text: {
    paddingHorizontal:135,
    marginBottom: 10,
    borderRadius:6,
    padding: 10,
    fontSize:20,
    backgroundColor:lightBlue,
    alignSelf: 'center',
  },
  icon: {
    // alignSelf: 'left'
  },
  inviteName: {
    width: 300,
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#A020F0'
  }
})