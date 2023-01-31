import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import { MyTextInput, BlueButton , PasswordTextInput} from "../styles/globalStyles";

import { AuthContext } from '../context/AuthContext'

import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';


export default function EditPassword({ setModalOpen, EditData }) {

    const { editPassword } = useContext(AuthContext)

    const [ hidePassword, setHidePassword ] = useState(true);



    const editPasswordSubmit = (info) => {
        info.email = EditData["email"]
        editPassword(info)
        setModalOpen(false)
    }


    return (
        <KeyboardAvoidingWrapper>
            <View>
                <Formik
                    initialValues={{
                        OldPassword: "",
                        password: "",
                        confirmpassword: ""
                    }}
                >
                    {(props) => (
                        <View>
                            <PasswordTextInput
                                text='Old password'
                                onChangeText={props.handleChange('OldPassword')}
                                autoCapitalize="none"
                                value={props.values.OldPassword}
                                secureTextEntry={hidePassword}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <PasswordTextInput
                                text='New password'
                                onChangeText={props.handleChange('password')}
                                autoCapitalize="none"
                                value={props.values.password}
                                secureTextEntry={hidePassword}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <PasswordTextInput
                                text='Confirm new password'
                                onChangeText={props.handleChange('confirmpassword')}
                                autoCapitalize="none"
                                value={props.values.confirmpassword}
                                secureTextEntry={hidePassword}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <BlueButton
                                onPress={() => { editPasswordSubmit(props.values) }}
                                buttonText="Submit Edit"
                            />
                        </View>
                    )}
                </Formik>
            </View>
        </KeyboardAvoidingWrapper>
    );

};