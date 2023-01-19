import React, { useContext } from 'react';
import { View } from 'react-native';
import { globalStyles, StyledButton, SubmitText, MyTextInput } from "../styles/globalStyles";

import { Formik } from 'formik';

import { ExpContext } from '../context/ExpContext';

export default function AddExpenses({ setModalOpen }) {
  const { postExp } = useContext(ExpContext);
  //need somesort of dropdown menu to select user
  // drop down using get user? and use username to display name?
  

  return(
    <View style={globalStyles.container}>
      <Formik
        initialValues={{ itemName: '', money: '' }}
        onSubmit={(values) => {
          postExp(values);
          setModalOpen(false);
        }}
      >
        {(props) => (
          <View>
            {/* <MyTextInput
              label="User Name"
              icon="account"
              placeholder="David"
              onChangeText={props.handleChange('userName')}
              value={props.values.userName}
            /> */}
            <MyTextInput
              label="Item"
              icon="basket"
              placeholder="Hotel"
              onChangeText={props.handleChange('itemName')}
              value={props.values.itemName}
            />
            <MyTextInput
              label="Cost"
              icon="currency-jpy"
              placeholder="1,000"
              onChangeText={props.handleChange('money')}
              value={props.values.money}
              keyboardType='numeric'
            />

            <StyledButton onPress={props.handleSubmit}>
                <SubmitText/>
            </StyledButton>
          </View>
        )}

      </Formik>
    </View>
  )
};