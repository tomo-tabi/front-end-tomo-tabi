import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { globalStyles, colors, AddButton, StyledModal, NoItemMessage, EditButton } from "../styles/globalStyles";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext } from "../context/AuthContext";
import { ExpContext } from "../context/ExpContext";
import { TripContext } from "../context/TripContext";

import { Balance } from "./Balance";

import AddExpenses from "./AddExpenses";
import EditExpenses from "./EditExpense";

const { primary, blue, yellow, lightBlue } = colors;

export const ExpenseTable = () => {
  const { userData } = useContext(AuthContext);//to extract username?
  const { usersInTrip, permission, owner } = useContext(TripContext);
  const { getExp, expData } = useContext(ExpContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [splitPaymentsData, setSplitPaymentData] = useState([[], []]);
  const [tableHead, setTableHead] = useState(["Name", "Item", "Cost", "Edit"]);
  const [tableData, setTableData] = useState([]);
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [expenseEditData, setExpenseEditData] = useState({}) // Set the event I want to send to Edit Timeline component

  const [expensesView, setExpensesView] = useState(true)
  const [balanceView, setBalanceView] = useState(false)

  useEffect(() => {
    getExp();
  }, []);

  //format data for table
  useEffect(() => {
    let expArr = [];

    if (expData) {
      expData.forEach((obj) => {
        let edit
        if (obj.email === userData.email) {
          {
            owner ?
              edit =
              <EditButton
                setModalOpen={setModalEditOpen}
                setEditData={setExpenseEditData}
                editData={obj}
                style={{ alignSelf: 'center' }}
              />
              :
              permission ?
                null
                :
                edit =
                <EditButton
                  setModalOpen={setModalEditOpen}
                  setEditData={setExpenseEditData}
                  editData={obj}
                  style={{ alignSelf: 'center' }}
                />
          }

        } else {
          edit = <View></View>
        }
        //formate name, item name and money
        expArr.push([
          obj.username,
          obj.item_name,
          Math.trunc(obj.money),
          edit
        ])
      })

      setTableData(expArr);
    }

    let expObj = {}

    if (expData) {
      expData.forEach((obj) => {
        if (expObj[obj.username]) {
          expObj[obj.username] = Number(expObj[obj.username]) + Number(obj.money)
        }
        if (!expObj[obj.username]) {
          expObj[obj.username] = Number(obj.money)
        }
      })
      usersInTrip.forEach((userObj) => {
        if (!expObj[userObj.username]) {
          expObj[userObj.username] = 0
        }
      })
      return setSplitPaymentData(splitPayments(expObj))
    }
    setTableData([]);

  }, [expData])

  const splitPayments = (payments) => {
    const result = []
    const someoneOwnsYou = []
    const oweYou = []
    const people = Object.keys(payments);
    const valuesPaid = Object.values(payments);

    const sum = valuesPaid.reduce((acc, curr) => curr + acc);
    const mean = sum / people.length;

    const sortedPeople = people.sort((personA, personB) => payments[personA] - payments[personB]);
    const sortedValuesPaid = sortedPeople.map((person) => payments[person] - mean);

    let i = 0;
    let j = sortedPeople.length - 1;
    let debt;

    while (i < j) {
      debt = Math.min(-(sortedValuesPaid[i]), sortedValuesPaid[j]);
      sortedValuesPaid[i] += debt;
      sortedValuesPaid[j] -= debt;

      if (sortedPeople[i] === userData.username) {
        someoneOwnsYou.push(<Text style={styles.oweCalc} key={i}>You owe {sortedPeople[j]} ¥{Math.trunc(debt)}</Text>);
      }

      if (sortedPeople[j] === userData.username) {
        oweYou.push(<Text style={styles.oweCalc} key={j}>{sortedPeople[i]} owes you ¥ {Math.trunc(debt)}</Text>)
      }


      if (sortedValuesPaid[i] === 0) {
        i++;
      }

      if (sortedValuesPaid[j] === 0) {
        j--;
      }
    }

    result.push(someoneOwnsYou)
    result.push(oweYou)

    return result
  }

  // post exp needs: itemName, money, optional purchaserid (if blank defaults to userid)

  return (
    <View style={{ flex: 1, backgroundColor: primary }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.buttonsContainer]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: expensesView ? lightBlue : primary }]}
            onPress={() => { setBalanceView(false); setExpensesView(true) }}
          >
            <MaterialCommunityIcons name='table' size={30} style={{ marginRight: 10, color: yellow }} />
            <Text style={{ textAlignVertical: 'center', fontSize: 18 }}>
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: balanceView ? lightBlue : primary }]}
            onPress={() => { setExpensesView(false); setBalanceView(true) }}
          >
            <MaterialCommunityIcons name='scale-balance' size={30} style={{ marginRight: 10, color: blue }} />
            <Text style={{ textAlignVertical: 'center', fontSize: 18 }}>
              Balance
            </Text>
          </TouchableOpacity>
        </View>
        {expensesView &&
          <Table style={{ borderTopEndRadius: 7, borderTopStartRadius: 7, margin: 3, overflow: 'hidden' }}>
            <TableWrapper>
              <Row data={tableHead} style={styles.head} textStyle={styles.text} />
              {
                tableData.map((data, i) => (
                  <TableWrapper style={styles.wrapper} key={i}>
                    {
                      data.map((cell, j) => (
                        <Cell onPress={() => console.log(j)} key={j} data={cell} textStyle={styles.text} borderStyle={styles.cellBorderStyle} />
                      ))
                    }
                  </TableWrapper>
                ))
              }
            </TableWrapper>
          </Table>
        }
        {expensesView && tableData.length === 0 &&
          <View style={[{ flex: 1, marginTop: 25 }]}>
            <NoItemMessage text='No Expenses Yet' style={{ textAlignVertical: 'center' }} />
          </View>
        }

        {balanceView && <Balance />}
        {balanceView && tableData.length === 0 &&
          <View style={[{ flex: 1, marginTop: 25 }]}>
            <NoItemMessage text='No Balances Yet' style={{ textAlignVertical: 'center' }} />
          </View>
        }

        <StyledModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          AddComponent={AddExpenses}
        />

      </ScrollView>

      <StyledModal
        modalOpen={modalEditOpen}
        setModalOpen={setModalEditOpen}
        AddComponent={EditExpenses}
        EditData={expenseEditData}
      />

      {expensesView ?
        owner ?
          <>
            <AddButton
              setModalOpen={setModalOpen}
            />

            <View style={{ height: 90 }}>
            </View>
          </>
          :
          permission ?
            <View></View>
            :
            <>
              <AddButton
                setModalOpen={setModalOpen}
              />

              <View style={{ height: 90 }}>
              </View>
            </>
        : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: primary,
    flex: 1,
    flexDirection: 'row',
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 6,
    width: "50%",
    margin: 5,
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderBottomColor: blue,
    borderBottomWidth: 1,
    backgroundColor: primary,
  },

  head: {
    flex: 1,
    height: 40,
    backgroundColor: blue,
  },
  buttons: {
    width: 300,
    height: 70,
    flexDirection: 'row',
    position: "absolute",
    bottom: 15,
    overflow: 'visible',

  },
  text: {// table text
    textAlign: "center",

  },
  textOwe: {
    fontSize: 20,

  },
  textOweTitle: {
    fontWeight: "bold",
    fontSize: 24
  },
  oweCalc: {
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 10,
  },
  calcView: {
    flex: 1,
    padding: 5,
    marginBottom: 10,
    backgroundColor: blue,
    borderRadius: 6
  },
});