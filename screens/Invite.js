import React, { useContext } from 'react';
import { View } from 'react-native';
import { globalStyles, StyledButton, SubmitText, MyTextInput } from "../styles/globalStyles";

import { Formik } from 'formik';

import { InfoContext } from '../context/InfoContext';

export default function Invite() {
  const { postInvite } = useContext(InfoContext);

  return (
    <View style={globalStyles.container}>
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
  
            <StyledButton onPress={props.handleSubmit}>
              <SubmitText />
            </StyledButton>
          </>
        )}
      </Formik>
    </View>
  )
};
