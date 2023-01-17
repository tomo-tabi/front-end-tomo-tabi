import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {Formik} from 'formik';

import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
} from '../styles/styles';

import { ExpContext } from '../context/ExpContext';

export default function AddExpenses({ setModalOpen }) {
  const { postExp } = useContext(ExpContext);
  //need somesort of dropdown menu to select user
  // drop down using get user? and use username to display name?
  

  return(
    <View style={styles.container}>
      <Formik
        initialValues={{ itemName: '', money: '' }}
        onSubmit={(values) => {
          postExp(values);
          setModalOpen(false);
          
        }}
      >
        {(props) => (
          <View>
            {/* <MyTextInput
              label="User Name"
              icon="account"
              placeholder="David"
              onChangeText={props.handleChange('userName')}
              value={props.values.userName}
            /> */}
            <MyTextInput
              label="Item"
              icon="basket"
              placeholder="Hotel"
              onChangeText={props.handleChange('itemName')}
              value={props.values.itemName}
            />
            <MyTextInput
              label="Cost"
              icon="currency-jpy"
              placeholder="1,000"
              onChangeText={props.handleChange('money')}
              value={props.values.money}
              keyboardType='numeric'
            />

            <StyledButton onPress={props.handleSubmit}>
                <ButtonText>
                    Submit
                </ButtonText>
            </StyledButton>
          </View>
        )}

      </Formik>
    </View>
  )
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },

})

const MyTextInput = ( { label, icon, ...props }) => {
  return (
      <View>
          <LeftIcon>
              <MaterialCommunityIcons name={icon} size={30} />
              
          </LeftIcon>
          <StyledInputLabel>{label}</StyledInputLabel>
          <StyledTextInput {...props} />
      </View>
  );
};