import React, { useContext } from 'react';
import { View } from 'react-native';
import { globalStyles, colors, MyTextInput, BlueButton } from "../styles/globalStyles";
const { primary } = colors;

import { Formik } from 'formik';

import { InfoContext } from '../context/InfoContext';

export default function Invite() {
  const { postInvite } = useContext(InfoContext);

  return (
    <View style={[globalStyles.container,{backgroundColor: primary}]}>
      <Formik
        initialValues={{ email: ''}}
        onSubmit={(values, actions) => {
          actions.resetForm();
          postInvite(values);
        }}
      >
        {(props) => (
          <>
            <MyTextInput
              label="User Email"
              icon="account-plus-outline"
              placeholder="abc@gmail.com"
              onChangeText={props.handleChange('email')}
              value={props.values.email}
            />

            <BlueButton
              onPress={props.handleSubmit}
              buttonText="Submit"
            />
          </>
        )}
      </Formik>
    </View>
  )
};
