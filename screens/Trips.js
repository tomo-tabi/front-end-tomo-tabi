import React, { useState, useContext } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Modal } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { InfoContext } from '../context/InfoContext';
import { StyledButton, ButtonText } from '../styles/styles';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import moment from 'moment';

import AddTrip from './AddTrip';

export default function Trips({ navigation }) {
  const { logout } = useContext(AuthContext); 
  const { trips } = useContext(InfoContext); 
  const [ modalOpen, setModalOpen ] = useState(false);

  const pressHandler = (item) => {
    navigation.navigate('TripTabNav', {
      screen: 'TimeLine',
      // need to wrap it in obj to pass to nested nav
      params: {id: item.id, name:item.name},
    })
  }

  const dateFormat = (startDate, endDate) => {

    return `${moment(startDate).format("MMMM, Do")} ➡︎ ${moment(endDate).format("MMMM Do, YYYY")}` 
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>

        <Modal visible={modalOpen} animationType='slide'>
          <View style={StyleSheet.modalContent}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setModalOpen(false)}
            />
            <AddTrip setModalOpen={setModalOpen} />
          </View>
        </Modal>

        <FlatList
          keyExtractor={( item ) => item.id}
          data = {trips}
          renderItem = {({ item }) => (
            <TouchableOpacity onPress={() => pressHandler(item)}>
              <Text style={styles.date}>{dateFormat(item.start_date, item.end_date)}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <StyledButton onPress={() => logout()}>
          <ButtonText>
            Logout
          </ButtonText>
        </StyledButton>

        <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.iconContainer}>
          <MaterialCommunityIcons
            name='plus'
            size={50}
            style={styles.modalToggle}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer:{
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },

  date:{
    fontSize: 20,
    marginTop: 10,
  },

  name:{
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    borderRadius: 6,
    backgroundColor:'#9CCAEC'
  },

  iconContainer:{
    alignItems:"center",
    alignSelf:"flex-end",
    backgroundColor:'#F187A4',
    borderRadius: 40,
    justiftyContent:"center",
    margin:5,
    
    height:70,
    width:70,
    
    position:"absolute",
    right:0,
    bottom:10,

    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 7,
  },

  modalToggle: {
    margin:10,
    alignSelf:"flex-end",
    color:'#fff',
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
  },
  text: {
    marginBottom: 10,
    padding: 10,
    alignSelf: 'center'
  },
})