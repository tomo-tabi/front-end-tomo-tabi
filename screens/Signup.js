import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert } from "react-native";

//formik
import { Formik } from 'formik';

//icons
import { Octicons, Ionicons } from '@expo/vector-icons';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyleFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    StyledButton,
    ButtonText,
    Colors,
    MsgBox
} from '../styles/styles';

import {View} from 'react-native';

const {brand, darkLight} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';

const Signup = ({ navigation }) => {
    const [ hidePassword, setHidePassword ] = useState(true);
    // function handeling token and async storage and update loginState
    const pressHandler = (userInputObj) => {
        if(userInputObj.password !== userInputObj.confirmpassword) {
            return Alert.alert(
                "Wrong Password",
                "comfirmation Password is wrong",
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
        }
        // do fetch to post user info
        console.log(userInputObj);
        navigation.navigate('Welcome')
    }
    return (
      <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style={"dark"} />
            <InnerContainer>
                <PageTitle>Tomo Tabi</PageTitle>
                <SubTitle>Account Signup</SubTitle>

                <Formik
                    initialValues={{ username: '', email: '', password: '', confirmpassword: '' }}
                    onSubmit={(userInputObj) => pressHandler(userInputObj)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values }) => (
                        <StyleFormArea>
                          <MyTextInput 
                              label="User Name"
                              icon="person"
                              placeholder="David Barnes"
                              placeholderTextColor={darkLight}
                              onChangeText={handleChange('username')}
                              onBlur={handleBlur('username')}
                              value={values.username}
                          />

                          <MyTextInput 
                              label="Email Address"
                              icon="mail"
                              placeholder="xxx@gmail.com"
                              placeholderTextColor={darkLight}
                              onChangeText={handleChange('email')}
                              onBlur={handleBlur('email')}
                              value={values.email}
                              keyboardType="email-address"
                          />
  
                          <MyTextInput 
                              label="Password"
                              icon="lock"
                              placeholder="* * * * * * *"
                              placeholderTextColor={darkLight}
                              onChangeText={handleChange('password')}
                              onBlur={handleBlur('password')}
                              value={values.password}
                              secureTextEntry={hidePassword}
                              isPassword={true}
                              hidePassword={hidePassword}
                              setHidePassword={setHidePassword}
                          />

                          <MyTextInput 
                              label="Confirm Password"
                              icon="lock"
                              placeholder="* * * * * * *"
                              placeholderTextColor={darkLight}
                              onChangeText={handleChange('confirmpassword')}
                              onBlur={handleBlur('confirmpassword')}
                              value={values.confirmpassword}
                              secureTextEntry={hidePassword}
                              isPassword={true}
                              hidePassword={hidePassword}
                              setHidePassword={setHidePassword}
                          />

                          <MsgBox></MsgBox>
                          <StyledButton onPress={handleSubmit}>
                              <ButtonText>
                                  Signup
                              </ButtonText>
                          </StyledButton>
                        </StyleFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
      </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ( { label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    );
};

export default Signup;