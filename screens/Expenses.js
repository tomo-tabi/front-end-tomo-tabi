import React, {useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';


export const ExpenseTable = () => {
  const [tableHead, setTableHead] = useState(['Name', 'Item', 'Money']);
  const [tableData, setTableData] = useState([
    ['Matthew', 'tickets', 5000],
    ['Eric', 'drinks', 1500],
    ['Pol', 'Hotel Fee', 6000]
  ]);

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1 }}>
        <Row data={tableHead} flexArr={[2,2,1]} style={styles.head} textStyle={styles.text} />
          <TableWrapper style={styles.wrapper}>
            <Rows data={tableData} flexArr={[2,2,1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
      </Table>
    </View>

  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 250,
    },
    head: {  
        height: 40, 
        backgroundColor: '#f1f8ff',
    },
    wrapper: { 
        flexDirection: 'row',
    },
    title: { 
        flex: 1, 
        backgroundColor: '#f6f8fa',
    },
    row: {  
        height: 28,  
    },
    text: { 
        textAlign: 'center',
    },
});