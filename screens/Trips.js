import React, { useState, useContext } from 'react'
import { StyleSheet, Text, FlatList, View, TouchableOpacity, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { InfoContext } from '../context/InfoContext';
import { StyledButton, ButtonText } from '../styles/styles';

export default function Trips({ navigation }) {
  const { logout } = useContext(AuthContext); 
  const { trips } = useContext(InfoContext); 

  const pressHandler = (item) => {
    navigation.navigate('TripTabNav', {
      screen: 'TimeLine',
      params: {id: item.id, name:item.tripName},
    })
  }
  
  return (
    <>
    <View style={styles.container}>
      <FlatList
        keyExtractor={( item ) => item.id}
        data = {trips}
        renderItem = {({ item }) => (
          <TouchableOpacity onPress={() => pressHandler(item)}>
            <Text style={styles.date}>{item.tripName}</Text>
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
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },

  date:{
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 6,
    backgroundColor:'#A020F0'
  }
})