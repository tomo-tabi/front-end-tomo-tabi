import React, { useState, useCallback, useContext, useEffect } from "react";
import { Linking, StyleSheet, View, TouchableOpacity, FlatList, Text } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { globalStyles, colors, StyledButton, AddButton, StyledModal } from "../styles/globalStyles";

import { AuthContext } from "../context/AuthContext";
import { ExpContext } from "../context/ExpContext";

import AddExpenses from "./AddExpenses";

const { primary, blue } = colors;

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
    
    return(
      <StyledButton onPress={handlePress}>
        <Text style={globalStyles.buttonText}>{children}</Text>
      </StyledButton>
    );
  };

  // post exp needs: itemName, money, optional purchaserid (if blank defaults to userid)

  return (
    <View style={styles.tableContainer}>
      <Table style={styles.table}>
        <TableWrapper>
            <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          {
            tableData.map((data, i) => (
              <TableWrapper>
                <TouchableOpacity key={i} style={styles.wrapper} onPress={() => editData(data, i)}>
                  {
                    data.map((cell, j) => (
                      <Cell key={j} data={cell} textStyle={styles.text} borderStyle={styles.cellBorderStyle}/>
                    ))
                  }
                </TouchableOpacity>
              </TableWrapper>
            ))                          
          }
        </TableWrapper>
      </Table>
      <View style={globalStyles.container}>
        
        <OpenURLButton url={PayPayURL}>Open PayPay</OpenURLButton>
        <OpenURLButton url={LinePayURL}>Open Line Pay</OpenURLButton>

        {StyledModal(modalOpen, setModalOpen, AddExpenses)}

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
        
        <TouchableOpacity onPress={() => setModalOpen(true)} style={globalStyles.addIconButton}>
          <AddButton/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    backgroundColor: primary,
  },

  wrapper: {
    flexDirection: "row",
    height: 40,
    borderBottomColor: blue,
    borderBottomWidth:1,
  },

  head: {
    height: 40,
    backgroundColor: blue,
  },

  table: {
    marginBottom:10,
  },

  moneyCalc:{
    marginVertical:10,
    marginHorizontal:10,
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