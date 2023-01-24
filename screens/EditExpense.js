import React, { useContext } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { MyTextInput, BlueButton } from "../styles/globalStyles";

import { ExpContext } from '../context/ExpContext';

export default function EditExpenses({ setModalOpen, EditData }) {
    const { editExpense, deleteExpense } = useContext(ExpContext)

    const editExpenseSubmit = (info) => {
        editExpense(info)
        setModalOpen(false)
    }

    const deleteExpenseSubmit = (info) => {
        deleteExpense(info)
        setModalOpen(false)
    }

    return (
        <>
            <Formik
                initialValues={{ itemName: EditData["item_name"], money: EditData["money"], id: EditData["id"]  }}
            >
                {(props) => (
                    <View>
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

                        <BlueButton
                            onPress={() => { editExpenseSubmit(props.values) }}
                            buttonText="Submit Edit"
                        />
                        <BlueButton
                            onPress={() => deleteExpenseSubmit(props.values)}
                            buttonText="Delete Expense"
                        />
                    </View>
                )}
            </Formik>
        </>
    )
};