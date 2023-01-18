import React, { useState, useCallback, useContext, useEffect } from "react";
import { Alert, Button, Linking, StyleSheet, View, TouchableOpacity, Modal, FlatList, Text } from "react-native";
import { Table, TableWrapper, Row, Rows, Cell } from "react-native-table-component";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from "../context/AuthContext";
import { ExpContext } from "../context/ExpContext";
import AddExpenses from "./AddExpenses";

export const ExpenseTable = () => {
  const [ modalOpen, setModalOpen ] = useState(false);

  const { userData } = useContext(AuthContext);//to extract username?
  const { getExp, expData } = useContext(ExpContext);

  const [splitPaymentsData, setSplitPaymentData] = useState([[],[]]);
  const [tableHead, setTableHead] = useState(["Name", "Item", "Cost"]);
  // const [tableData, setTableData] = useState([
  //   ["Matthew", "tickets", 5000],
  //   ["Eric", "drinks", 1500],
  //   ["Pol", "Hotel Fee", 6000],
  // ]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getExp()
  }, [])

  //format data for table
  useEffect(() => {
    let expArr = [];

    if(expData){
      expData.forEach((obj) => {
        //formate name, item name and money?
        expArr.push([
          obj.username,
          obj.item_name,
          obj.money
        ])
      })
      setTableData(expArr)
    }

    let expObj = {}

    if (expData) {
      expData.forEach((obj) => {
        if(expObj[obj.username]){
          expObj[obj.username] = Number(expObj[obj.username]) + Number(obj.money)
        }
        if(!expObj[obj.username]){
          expObj[obj.username] =  Number(obj.money)
        }
      })
      setSplitPaymentData(splitPayments(expObj))
    }


  },[expData])

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

      if(sortedPeople[i] === userData.username){
        someoneOwnsYou.push(<Text style={styles.textOwe}>You owe {sortedPeople[j]} ¥{debt.toFixed(2)} </Text>);
      }

      if(sortedPeople[j] === userData.username){
        oweYou.push(<Text style={styles.textOwe}> {sortedPeople[i]} owes you ¥ {debt.toFixed(2)} </Text>)
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

  const renderItem = ({ item }) => {
    return (
      <Text style={styles.moneyCalc}>{item}</Text>
    )
  }

// console.log(splitPaymentsData);


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
          await Linking.openURL("https://play.google.com/store/apps/details?id=com.linecorp.linepay")
        }
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  // post exp needs: itemName, money, optional purchaserid (if blank defaults to userid)

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1 }} style={styles.table}>
        <TableWrapper >
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          {
            tableData.map((data, i) => (
              <TableWrapper >
                <TouchableOpacity key={i} style={styles.wrapper} onPress={() => editData(data, i)}>
                  {
                    data.map((cell, j) => (
                      <Cell key={j} data={cell} textStyle={styles.text} borderStyle={{ borderWidth: 1 }}/>
                    ))
                  }
                </TouchableOpacity>
              </TableWrapper>
            ))                          
          }
        </TableWrapper>
      </Table>
      
      <OpenURLButton url={PayPayURL}>Open PayPay</OpenURLButton>
      <OpenURLButton url={LinePayURL}>Open Line Pay</OpenURLButton>

      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <MaterialCommunityIcons
            name='window-close'
            size={24}
            style={{...styles.modalToggle, ...styles.modalClose}}
            onPress={() => setModalOpen(false)}
          />
          <AddExpenses setModalOpen={setModalOpen}/>
        </View>
      </Modal>

      <Text style={styles.textOweTitle} > {'\n'} You owe: </Text>

      {splitPaymentsData[0].length === 0 ?  <Text style={styles.textOwe}> Congrats, you don't owe anything. {'\n'} </Text>  : <FlatList
        data={splitPaymentsData[0]}
        renderItem={renderItem}
      />}

      <Text style={styles.textOweTitle}> Someone owes you:</Text>

      {splitPaymentsData[1].length === 0 ?  <Text style={styles.textOwe}> No one owes you anything...</Text>  : <FlatList
        data={splitPaymentsData[1]}
        renderItem={renderItem}
      />}
        
      <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.iconContainer}>
        <MaterialCommunityIcons
          name='plus'
          size={50}
          style={styles.modalToggle}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 2,
    paddingHorizontal: 10,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  wrapper: {
    flexDirection: "row",
    height: 40,
  },
  table: {
    marginBottom:10
  },
  moneyCalc:{
    marginVertical:10
  },
  // title: {
  //   flex: 1,
  //   backgroundColor: "#f6f8fa",
  // },
  row: {
    height: 28,
  },
  text: {
    textAlign: "center",
  },
  iconContainer:{
    alignItems:"center",
    alignSelf:"flex-end",
    backgroundColor:'#F187A4',
    borderRadius: 40,
    justiftyContent:"center",
    margin:5,
    marginRight:15,
    
    height:70,
    width:70,
    
    position:"absolute",
    right:0,
    bottom:10,

    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 7,
  },
  modalContent:{
    flex:1,
    margin:10,
  },
  modalToggle:{
    margin:10,
    alignSelf:"flex-end",
    color:'#fff',
  },
  modalClose:{
    margin:0,
    color:'black'
  },
  textOwe : {
    fontSize: 20
  },
  textOweTitle : {
    fontWeight: "bold",
    fontSize: 24
  }
});

{/* <Table borderStyle={{ borderWidth: 1 }}>
  <Row
    data={tableHead}
    flexArr={[2, 2, 1]}
    style={styles.head}
    textStyle={styles.text}
  />

  <TableWrapper style={styles.wrapper}>
    <Rows
      data={tableData}
      flexArr={[2, 2, 1]}
      style={styles.row}
      textStyle={styles.text}
    />
  </TableWrapper>
</Table> */}