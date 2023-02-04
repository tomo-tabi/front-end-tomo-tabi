import React, { useState, useCallback, useContext, useEffect } from "react";
import { Linking, StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { globalStyles, colors, AddButton, StyledModal, TempButton, EditButton } from "../styles/globalStyles";
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
  const { usersInTrip, permission } = useContext(TripContext);
  const { getExp, expData } = useContext(ExpContext);
  // const { tripid } = useContext(EventContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [splitPaymentsData, setSplitPaymentData] = useState([[], []]);
  const [tableHead, setTableHead] = useState(["Name", "Item", "Cost", "Edit"]);
  const [tableData, setTableData] = useState([]);
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [expenseEditData, setExpenseEditData] = useState({}) // Set the event I want to send to Edit Timeline component

  const [ expensesView, setExpensesView] = useState(true)
  const [ balanceView, setBalanceView] = useState(false)

  useEffect(() => {
    getExp();
  }, [])

  //format data for table
  useEffect(() => {
    let expArr = [];

    if (expData) {
      expData.forEach((obj) => {
        // console.log(obj.email, userData.email);

        let edit
        if (obj.email === userData.email) {
          { permission ?
            null
            :
            edit =
            <EditButton
              setModalOpen={setModalEditOpen}
              setEditData={setExpenseEditData}
              editData={obj}
              style={{ alignSelf: 'center' }}
            />}
          
        } else {
          edit = <View></View>
        }
        //formate name, item name and money?
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


  // const PayPayURL = "paypay://";

  // const LinePayURL = "linepay://";

  // const OpenURLButton = ({ url, children }) => {
  //   const handlePress = useCallback(async () => {
  //     // Checking if the link is supported for links with custom URL scheme.
  //     const supported = await Linking.canOpenURL(url);

  //     if (supported) {
  //       // Opening the link with some app, if the URL scheme is "http" the web link should be opened
  //       // by some browser in the mobile
  //       await Linking.openURL(url);
  //     } else {
  //       if (url == "paypay://") {
  //         await Linking.openURL("https://play.google.com/store/apps/details?id=com.paypay.android%22")
  //       }
  //       else {
  //         await Linking.openURL("https://play.google.com/store/apps/details?id=com.linepaycorp.talaria&hl=en&gl=US")
  //       }
  //     }
  //   }, [url]);

  //   return (
  //     <TempButton
  //       onPress={handlePress}
  //       buttonText={children}
  //     />
  //   );
  // };


  // post exp needs: itemName, money, optional purchaserid (if blank defaults to userid)

  return (
    <View style={{ flex: 1, backgroundColor:primary }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.buttonsContainer]}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: expensesView ? lightBlue : primary}]}
              onPress={() => {setBalanceView(false); setExpensesView(true)}}
            >
              <MaterialCommunityIcons name='table' size={30} style={{ marginRight: 10, color: yellow }} />
              <Text style={{ textAlignVertical: 'center', fontSize: 18 }}>
                Expenses
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: balanceView ? lightBlue : primary}]}
              onPress={() => {setExpensesView(false); setBalanceView(true)}}
            >
              <MaterialCommunityIcons name='scale-balance' size={30} style={{ marginRight: 10, color: blue }} />
              <Text style={{ textAlignVertical: 'center', fontSize: 18 }}>
                Balance
              </Text>
            </TouchableOpacity>
        </View>
          {expensesView && 
          <Table style={{borderRadius:7, margin:3, overflow:'hidden' }}>
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

          {balanceView && <Balance/>}

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
      { permission ?
        <View></View>
        :
            <AddButton
                setModalOpen={setModalOpen}
            />

      }
        <View style={{ height: 90 }}>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor:primary,
    flex:1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: "100%",
    alignSelf: "center",
    // height:100,
    paddingHorizontal:10,
  },
  button: {
    flexDirection: 'row',
    padding: 5,
    borderRadius:6,
    width:"50%",
    // alignContent:"center",
    // alignItems:'center',
    // alignSelf: "center",
    margin:5,
    // borderWidth:1,
    // borderRadius:20,
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
    // flex:1,
    width: 300,
    height: 70,
    flexDirection: 'row',
    // backgroundColor: pink,
    position: "absolute",
    bottom: 15,
    overflow: 'visible',
    // padding:5

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
    // borderWidth:1,
    padding: 5,
    marginBottom: 10,
    backgroundColor: blue,
    borderRadius: 6
  },
});