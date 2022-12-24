import React from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyleFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avater
} from '../styles/styles';



const Welcome = ({ navigation }) => {
    const logOut = () => {
        navigation.navigate('Login')
    }

    return (
        <>
            <StatusBar style={"dark"} />
            <InnerContainer>
                <WelcomeImage resezieMode="cover" source={require('./../assets/welcome.png')}/>
                <WelcomeContainer>
                  <PageTitle welcome={true}>Welcome, Buddy!</PageTitle>
                  <SubTitle welcome={true}>Matthew Eric</SubTitle>
                  <SubTitle welcome={true}>YoonjuPol@gmail.com</SubTitle>
                  <StyleFormArea>
                    <Avater resezieMode="cover" source={require('./../assets/travel.png')} />
                    <Line />
                    <StyledButton onPress={logOut}>
                        <ButtonText>
                            Logout
                        </ButtonText>
                    </StyledButton>
                    
                  </StyleFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
}

export default Welcome;