import React, { useState, useContext } from 'react';
import { Alert, View, Text } from "react-native";
import {Formik} from 'formik';
import { StatusBar } from 'expo-status-bar';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { globalStyles, colors, BlueButton } from "../styles/globalStyles";
const { primary, pink, blue, yellow, lightBlue, navy, grey } = colors
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
    Colors,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
} from '../styles/styles';
const { darkLight } = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';

import { AuthContext } from '../context/AuthContext';
// console.log(darkLight);

const Login = ( { navigation } ) => {
    const { login } = useContext(AuthContext);    

    const [ hidePassword, setHidePassword ] = useState(true);
    // function handeling token and async storage and update loginState
    // console.log("🍉",userData);

    const pressSignupHandler = () => {
        navigation.navigate('Signup')
    }

    return (
        <KeyboardAvoidingWrapper>
          <StyledContainer>
              <StatusBar style={"dark"} />
              <InnerContainer>
                  <PageLogo resezieMode="cover" source={require('./../assets/travel.png')} />
                  <PageTitle>Tomo Tabi</PageTitle>
                  <SubTitle>Account Login</SubTitle>
                  <Formik
                      initialValues={{ email: '', password: ''}}
                      onSubmit={(userInputObj) => {
                        login(userInputObj)
                      }}
                  >
                      {({ handleChange, handleBlur, handleSubmit, values }) => (
                          <StyleFormArea>
                            <MyTextInput 
                                label="Email Address"
                                icon="mail"
                                placeholder="xxx@gmail.com"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                autoCapitalize="none"
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput 
                                label="password"
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
                            <MsgBox></MsgBox>
                            <BlueButton
                                onPress={handleSubmit}
                                buttonText="Login"
                            />
                            <Line/>
                            <ExtraView>
                              <ExtraText>Don't have an account already?</ExtraText>
                              <TextLink onPress={pressSignupHandler}>
                                  <TextLinkContent>Sign up</TextLinkContent>
                              </TextLink>
                            </ExtraView>
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
                <Octicons name={icon} size={30} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} />
                </RightIcon>
            )}
        </View>
    );
};

export default Login;