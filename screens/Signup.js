import React, { useState, useContext } from 'react';
import { Alert, View, Text, StyleSheet, Image } from "react-native";
import { Formik } from 'formik';
import { colors, BlueButton, MyTextInput, PasswordTextInput } from "../styles/globalStyles";
const { primary, greyBlue } = colors

import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';

import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useContext(AuthContext);

  const [hidePassword, setHidePassword] = useState(true);

  const pressHandler = (userInputObj) => {
    if (userInputObj.password !== userInputObj.confirmpassword) {
      return Alert.alert(
        "Wrong Password",
        "comfirmation Password is wrong",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }
    signup(userInputObj);
  }

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <View style={styles.centerView}>
          <Image source={require('./../assets/travel.png')} style={styles.img} />
          <Text style={styles.title}>Tomo Tabi</Text>
          {/* <Text style={[globalStyles.header, {marginVertical:5, paddingVertical:0, fontSize:18}]}>Account Signup</Text> */}
        </View>

        <Formik
          initialValues={{ username: '', email: '', password: '', confirmpassword: '' }}
          onSubmit={(values) => {
            if (values.username == "" || values.email == "" || values.password == "" || values.confirmpassword == "") {
              return Alert.alert(
                "Blank spot!",
                "Please fill all of the fields",
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
            } else if (values.password !== values.confirmpassword) {
              return Alert.alert(
                "Wrong Password",
                "comfirmation Password is wrong",
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
            } else {
              pressHandler(values);
            }
          }}
        >
          {(props) => (
            <>
              <MyTextInput
                label="User Name"
                icon="account-outline"
                placeholder="John Doe"
                onChangeText={props.handleChange('username')}
                autoCapitalize="none"
                // onBlur={handleBlur('username')} what is this
                value={props.values.username}
              />
              <MyTextInput
                label="Email Address"
                icon="email-outline"
                placeholder="abc@gmail.com"
                onChangeText={props.handleChange('email')}
                autoCapitalize="none"
                // onBlur={handleBlur('email')} what is this
                value={props.values.email}
              />
              <PasswordTextInput
                text='Password'
                onChangeText={props.handleChange('password')}
                // onBlur={handleBlur('password')} what is this
                autoCapitalize="none"
                value={props.values.password}
                secureTextEntry={hidePassword}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />
              <PasswordTextInput
                text='Confirm password'
                onChangeText={props.handleChange('confirmpassword')}
                // onBlur={handleBlur('confirmpassword')} what is this
                autoCapitalize="none"
                value={props.values.confirmpassword}
                secureTextEntry={hidePassword}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />
              <Text></Text>
              {/* to put space between text and submit */}
              <BlueButton
                onPress={props.handleSubmit}
                buttonText="Submit"
              />
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primary,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: greyBlue,
  },
  img: {
    height: 100,
    resizeMode: 'contain',
  }
})
