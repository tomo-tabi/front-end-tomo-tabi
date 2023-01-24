import React, { useState, useCallback, useContext, useEffect } from "react";
import { Linking, StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { globalStyles, colors, AddButton, StyledModal, TempButton, EditModal } from "../styles/globalStyles";

import { AuthContext } from "../context/AuthContext";
import { ExpContext } from "../context/ExpContext";
import { EventContext } from "../context/EventContext";
import { TripContext } from "../context/TripContext";

import AddExpenses from "./AddExpenses";
import EditExpenses from "./EditExpense";

import { Ionicons } from '@expo/vector-icons';


const { primary, blue } = colors;

export const ExpenseTable = () => {
  const { userData } = useContext(AuthContext);//to extract username?
  const { getUsersInTrip, usersInTrip } = useContext(TripContext);
  const { getExp, expData } = useContext(ExpContext);
  const { tripid } = useContext(EventContext)

  const [modalOpen, setModalOpen] = useState(false);
  const [splitPaymentsData, setSplitPaymentData] = useState([[], []]);
  const [tableHead, setTableHead] = useState(["Name", "Item", "Cost", "Edit"]);
  const [tableData, setTableData] = useState([]);
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [expenseEditData, setExpenseEditData] = useState({}) // Set the event I want to send to Edit Timeline component

  useEffect(() => {
    getExp();
    getUsersInTrip(tripid);
  }, [])

  //format data for table
  useEffect(() => {
    let expArr = [];

    if (expData) {
      expData.forEach((obj) => {
        //formate name, item name and money?
        expArr.push([
          obj.username,
          obj.item_name,
          obj.money,
          <Ionicons
            name="ellipsis-horizontal-sharp"
            style={{ position: 'absolute', right: 37 }}
            size={24} color="black"
            onPress={()=> { setExpenseEditData(obj); setModalEditOpen(true) } } />
        ])
      })


      setTableData(expArr)
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
      usersInTrip.forEach((user) => {
        if (!expObj[user]) {
          expObj[user] = 0
        }
      })
      setSplitPaymentData(splitPayments(expObj))
    }


  }, [expData])

  const editData = (data, index) => {
    // if (index !== 3) return;
    console.log(data, index);
  };

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
        someoneOwnsYou.push(<Text style={styles.oweCalc}>You owe {sortedPeople[j]} ¥{debt.toFixed(2)}</Text>);
      }

      if (sortedPeople[j] === userData.username) {
        oweYou.push(<Text style={styles.oweCalc}>{sortedPeople[i]} owes you ¥ {debt.toFixed(2)}</Text>)
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


  const PayPayURL = "paypay://";

  const LinePayURL = "linepay://";

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        if (url == "paypay://") {
          await Linking.openURL("https://play.google.com/store/apps/details?id=com.paypay.android%22")
        }
        else {
          await Linking.openURL("https://play.google.com/store/apps/details?id=com.linepaycorp.talaria&hl=en&gl=US")
        }
      }
    }, [url]);

    return (
      <TempButton
        onPress={handlePress}
        buttonText={children}
      />
    );
  };

  // post exp needs: itemName, money, optional purchaserid (if blank defaults to userid)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Table>
          <TableWrapper>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            {
              tableData.map((data, i) => (
                <TableWrapper>
                  <TouchableOpacity key={i} style={styles.wrapper} onPress={() => editData(data, i)}>
                    {
                      data.map((cell, j) => (
                        <Cell onPress={() => console.log(j)} key={j} data={cell} textStyle={styles.text} borderStyle={styles.cellBorderStyle} />
                      ))
                    }
                  </TouchableOpacity>
                </TableWrapper>
              ))
            }
          </TableWrapper>
        </Table>

        <View style={globalStyles.container}>

          <StyledModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            AddComponent={AddExpenses}
          />

          <View style={styles.calcView}>

            <Text style={styles.textOweTitle} > You owe: </Text>

            {splitPaymentsData[0].length === 0 ? <Text style={styles.oweCalc}>Congrats, you don't owe anything. </Text> :
              splitPaymentsData[0].map((item) => {
                // console.log(item);
                return (item)
              })
              // <FlatList
              //   data={splitPaymentsData[0]}
              //   renderItem={renderItem}
              // />
            }

            <Text style={styles.textOweTitle}> Someone owes you:</Text>

            {splitPaymentsData[1].length === 0 ? <Text style={styles.oweCalc}>No one owes you anything...</Text> :
              splitPaymentsData[1].map((item) => {
                // console.log(item);
                return (item)
              })
              // <FlatList
              //   data={splitPaymentsData[1]}
              //   renderItem={renderItem}
              // />
            }
          </View>

        </View>
      </ScrollView>
      <View style={{ height: 100, backgroundColor: primary, }}>
        <View style={styles.buttons}>
          <OpenURLButton url={PayPayURL}>Open PayPay</OpenURLButton>
          <OpenURLButton url={LinePayURL}>Open Line Pay</OpenURLButton>
        </View>
        <AddButton
          setModalOpen={setModalOpen}
        />
      </View>

      <EditModal
          modalEditOpen={modalEditOpen}
          setModalEditOpen={setModalEditOpen}
          EditComponent={EditExpenses}
          EditData={expenseEditData}
        />
    </View>
  );
};

const styles = StyleSheet.create({
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