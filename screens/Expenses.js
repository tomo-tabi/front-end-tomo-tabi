import React, { useState, useCallback, useContext } from "react";
import { Alert, Button, Linking, StyleSheet, View, TouchableOpacity } from "react-native";
import { Table, TableWrapper, Row, Rows, Cell } from "react-native-table-component";
// import { AuthContext } from "./AuthContext";
// import { ExpContext } from "./ExpContext.js";

export const ExpenseTable = () => {
  // const { userData } = useContext(AuthContext);//to extract username
  // const { getExp, postExp } = useContext(ExpContext);

  const [tableHead, setTableHead] = useState(["Name", "Item", "Money"]);
  const [tableData, setTableData] = useState([
    ["Matthew", "tickets", 5000],
    ["Eric", "drinks", 1500],
    ["Pol", "Hotel Fee", 6000],
  ]);

  const showData = (data, index) => {
    // if (index !== 3) return;
    console.log(data, index);
  }

  const editData = (data, i) => {
    console.log(data);
  }

  const supportedURL = "paypay://";

  const unsupportedURL = "linepay://";

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);
      const supported2 = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        await Linking.openURL("https://play.google.com/store/apps/details?id=com.paypay.android%22")

      }
      if (supported2) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        await Linking.openURL("https://play.google.com/store/apps/details?id=com.linecorp.linepay")

      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  // post exp needs: itemName, money, optional purchaserid (if blank defaults to userid)

  return (
    <View style={styles.container}>
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
      <Table borderStyle={{ borderWidth: 1 }}>
        <TableWrapper >
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          {
            tableData.map((data, i) => (
              <TableWrapper >
                <TouchableOpacity key={i} style={styles.wrapper} onPress={() => showData(data, i)}>
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
      
      <OpenURLButton url={supportedURL}>Open PayPay</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>Open Line Pay</OpenURLButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 250,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  wrapper: {
    flexDirection: "row",
    height: 40,
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
});