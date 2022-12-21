import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

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

import {View} from 'react-native';

const {brand, darkLight} = Colors;

const Login = ( { loginState } ) => {
    const [ hidePassword, setHidePassword ] = useState(true);
    // function handeling token and async storage and update loginState
    return (
        <StyledContainer>
            <StatusBar style={"dark"} />
            <InnerContainer>
                <PageLogo resezieMode="cover" source={require('./../assets/travel.png')} />
                <PageTitle>Tomo Tabi</PageTitle>
                <SubTitle>Account Login</SubTitle>

                <Formik
                    initialValues={{ email: '', password: ''}}
                    onSubmit={(values) => {
                        console.log(values);
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
                          <Line />
                          <ExtraView>
                            <ExtraText>Don't have an account already?</ExtraText>
                            <TextLink>
                                <TextLinkContent>Sign up</TextLinkContent>
                            </TextLink>
                          </ExtraView>
                        </StyleFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
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