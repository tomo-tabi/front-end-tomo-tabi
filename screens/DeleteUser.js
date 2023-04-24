import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import {
    BlueButton,
    PasswordTextInput,
} from '../styles/globalStyles';

import { AuthContext } from '../context/AuthContext';

import KeyboardAvoidingWrapper from '../styles/KeyboardAvoidingWrapper';

export default function DeleteUser({ setModalOpen, EditData }) {
    const { deleteUser } = useContext(AuthContext);

    const [hidePassword, setHidePassword] = useState(true);

    const deleteUserSubmit = info => {
        info.email = EditData['email'];
        console.log(info)
        deleteUser(info);
        setModalOpen(false);
    };

    return (
        <KeyboardAvoidingWrapper>
            <View>
                <Formik
                    initialValues={{
                        password: '',
                    }}
                >
                    {props => (
                        <View>

                            <Text>Please write your user's password to confirm your identity</Text>
                            <PasswordTextInput
                                text='Password'
                                onChangeText={props.handleChange('password')}
                                autoCapitalize='none'
                                value={props.values.password}
                                secureTextEntry={hidePassword}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <Text>Please be aware, this action will delete your user forever and all your saved trips in this account.</Text>
                            <BlueButton
                                onPress={() => {
                                    deleteUserSubmit(props.values);
                                }}
                                buttonText='Delete user'
                            />
                        </View>
                    )}
                </Formik>
            </View>
        </KeyboardAvoidingWrapper>
    );
}
