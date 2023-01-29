import React, { useContext } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { MyTextInput, BlueButton } from "../styles/globalStyles";

import { AuthContext } from '../context/AuthContext'

import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';


export default function EditUserInfo({ setModalOpen, EditData }) {

    const { editUser } = useContext(AuthContext)


    const editInfoSubmit = (info) => {
        editUser(info)
        setModalOpen(false)
    }


    return (
        <KeyboardAvoidingWrapper>
            <View>
                <Formik
                    initialValues={{
                        username: EditData["username"],
                        email: EditData["email"],
                    }}
                >
                    {(props) => (
                        <View>
                            <MyTextInput
                                label="User Name"
                                icon="account-outline"
                                placeholder="John Doe"
                                onChangeText={props.handleChange('username')}
                                autoCapitalize="none"
                                value={props.values.username}
                            />
                            <MyTextInput
                                label="Email Address"
                                icon="email-outline"
                                placeholder="abc@gmail.com"
                                onChangeText={props.handleChange('email')}
                                autoCapitalize="none"
                                value={props.values.email}
                            />
                            <BlueButton
                                onPress={() => { editInfoSubmit(props.values) }}
                                buttonText="Submit Edit"
                            />
                        </View>
                    )}
                </Formik>
            </View>
        </KeyboardAvoidingWrapper>
    );

};