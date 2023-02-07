import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Formik } from 'formik';
import { globalStyles, colors, BlueButton, MyTextInput, PasswordTextInput } from "../styles/globalStyles";
const { primary, greyBlue } = colors

import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';

import { AuthContext } from '../context/AuthContext';

export default function Login ( { navigation } ) {
  const { login } = useContext(AuthContext);    

  const [ hidePassword, setHidePassword ] = useState(true);

  const pressSignupHandler = () => {
    navigation.navigate('Signup')
  };

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <View style={styles.centerView}>
          <Image source={require('./../assets/travel.png')} style={styles.img}/>
          <Text style={styles.title}>Tomo Tabi</Text>
          <Text style={[globalStyles.header, {marginVertical:5, paddingVertical:0}]}>Login</Text>
        </View>

        <Formik
          initialValues={{ email: '', password: ''}}
          onSubmit={(values) => {
            if(values.email == "" || values.password == "") {
              return Alert.alert(
                  "Blank spot!",
                  "Please fill all of the fields",
                  [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                  ]
                );
            }else {
              login(values);
            }
          }}
        >
        {(props) => (
          <>
            <MyTextInput
              label="Email Address"
              icon="email-outline"
              placeholder="abc@gmail.com"
              onChangeText={props.handleChange('email')}
              autoCapitalize="none"
              // onBlur={props.handleBlur('email')} //what is this
              value={props.values.email}
            />
            <PasswordTextInput
              text='Password'
              onChangeText={props.handleChange('password')}
              // onBlur={props.handleBlur('password')} //what is this
              autoCapitalize="none"
              value={props.values.password}
              secureTextEntry={hidePassword}
              hidePassword={hidePassword}
              setHidePassword={setHidePassword}
            />

            <BlueButton
              onPress={props.handleSubmit}
              buttonText="Submit"
            />
            
            <View style={styles.line}></View>

            <View style={styles.centerView}>
              <Text>Don't have an account already?</Text>
              <TouchableOpacity onPress={pressSignupHandler}>
                  <Text style={{color: greyBlue, fontSize: 15}}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        </Formik>
        
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: primary, 
    paddingHorizontal:20, 
    paddingTop:30,
    justifyContent: 'space-around',
  },
  centerView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  line:{
    height:0.7,
    backgroundColor:greyBlue,
    marginVertical:10,
  },
  title:{
    fontWeight:'bold',
    fontSize:30,
    textAlign:'center', 
    color: greyBlue, 
  },
  img:{
    height:190,
    resizeMode:'contain',
  }
})
