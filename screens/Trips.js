import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Modal } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { InfoContext } from '../context/InfoContext';
import { StyledButton, ButtonText } from '../styles/styles';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import AddTrip from './AddTrip';

export default function Trips({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { trips, invites, rejectInvites, acceptInvites } = useContext(InfoContext);
  const [modalOpen, setModalOpen] = useState(false);

  const pressHandler = (item) => {
    navigation.navigate('TripTabNav', {
      screen: 'TimeLine',
      // need to wrap it in obj to pass to nested nav
      params: { id: item.id, name: item.name },
    })
  }


  return (
    <>
      <View style={styles.container}>

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

        <MaterialIcons
          name="add"
          size={24}
          style={styles.modalToggle}
          onPress={() => setModalOpen(true)}
        />
        <View>
          <Text style={styles.text}>Add new trip!</Text>
        </View>

        {invites !== "no invites found" ? <FlatList
          keyExtractor={(item) => item.userid}
          data={invites}
          renderItem={({ item }) => (
            <TouchableOpacity >
              <Text style={styles.date}>The user {item.username} has invited you to the following trip:</Text>
              <Text style={styles.inviteName}>{item.name} </Text>
              <MaterialCommunityIcons
                name='check-bold'
                size={24}
                style={{ ...styles.icon, }}
                onPress={() => acceptInvites(item.id)}
              />
              <MaterialCommunityIcons
                name='window-close'
                size={24}
                style={{ ...styles.icon, }}
                onPress={() => rejectInvites(item.id)}
              />
            </TouchableOpacity>
          )}
        /> : ""}

        <FlatList
          keyExtractor={(item) => item.userid}
          data={trips}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => pressHandler(item)}>
              <Text style={styles.date}>{item.start_date}➡️➡️{item.end_date}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <StyledButton onPress={() => logout()}>
          <ButtonText>
            Logout
          </ButtonText>
        </StyledButton>
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 20,
    marginTop: 10,
    marginHorizontal: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#A020F0'
  },
  modalToggle: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center'
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