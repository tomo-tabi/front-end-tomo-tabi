import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, FlatList, View, Modal, TouchableOpacity, TextInput } from 'react-native';
import { InfoContext } from '../context/InfoContext';
import {Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';

import {
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
} from '../styles/styles';



export default function Invite(params) {
  const { postInvite } = useContext(InfoContext);

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: ''}}
        onSubmit={(values, actions) => {
          actions.resetForm();
          postInvite(values);
        }}
      >
        {(props) => (
          <View style={styles.innerContainer}>
            <MyTextInput
              label="User Email"
              icon="person"
              placeholder="abc@gmail.com"
              onChangeText={props.handleChange('email')}
              value={props.values.email}
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
  innerContainer:{
    marginTop:10,
    marginHorizontal: 10
  },

})

const MyTextInput = ( { label, icon, ...props }) => {
  return (
      <View>
          <LeftIcon>
              <Octicons name={icon} size={30} />
          </LeftIcon>
          <StyledInputLabel>{label}</StyledInputLabel>
          <StyledTextInput {...props} />
      </View>
  );
};
