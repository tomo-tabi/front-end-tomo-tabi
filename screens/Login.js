import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, View } from "react-native";

//formik
import {Formik} from 'formik';

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
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
} from '../styles/styles';

const {brand, darkLight} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';
import { AuthContext } from '../context/AuthContext';


const Login = ( { navigation } ) => {
    const [ hidePassword, setHidePassword ] = useState(true);
    // function handeling token and async storage and update loginState
    
    const { login } = useContext(AuthContext);    
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
                            <StyledButton onPress={handleSubmit}>
                                <ButtonText>
                                    Login
                                </ButtonText>
                            </StyledButton>
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

export default Login;