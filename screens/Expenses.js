import React, { useState, useCallback } from "react";
import { Alert, Button, Linking, StyleSheet, View } from "react-native";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";

export const ExpenseTable = () => {
  const [tableHead, setTableHead] = useState(["Name", "Item", "Money"]);
  const [tableData, setTableData] = useState([
    ["Matthew", "tickets", 5000],
    ["Eric", "drinks", 1500],
    ["Pol", "Hotel Fee", 6000],
  ]);

  const supportedURL =
    "https://play.google.com/store/apps/details?id=jp.ne.paypay.android.app&hl=en&gl=US&pli=1";

  const unsupportedURL = "slack://open?team=123456";

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1 }}>
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
      </Table>
      <OpenURLButton url={supportedURL}>Open Supported URL</OpenURLButton>
      <OpenURLButton url={unsupportedURL}>Open Unsupported URL</OpenURLButton>
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
  },
  title: {
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  row: {
    height: 28,
  },
  text: {
    textAlign: "center",
  },
});
