import React, { useContext, useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { globalStyles, colors, AddButton, StyledModal, TempButton, EditButton } from "../styles/globalStyles";
const { primary, blue, yellow } = colors;


import { Card } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';



import { VictoryBar, VictoryChart, VictoryTheme, VictoryLabel, VictoryAxis, VictoryGroup } from "victory-native";




import { AuthContext } from "../context/AuthContext";
import { ExpContext } from "../context/ExpContext";
import { TripContext } from "../context/TripContext";

import AddExpenses from "./AddExpenses";



export const Balance = () => {

    const { userData } = useContext(AuthContext);//to extract username?
    const { usersInTrip } = useContext(TripContext);
    const { getExp, expData } = useContext(ExpContext);

    const [splitPaymentsData, setSplitPaymentData] = useState([[]]);
    const [modalOpen, setModalOpen] = useState(false);
    const [graphData, setGraphData] = useState([])


    useEffect(() => {
        getExp();
    }, [])

    useEffect(() => {

        let expObj = {}

        if (expData.length > 0) {
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
            setSplitPaymentData(splitPayments(expObj))
        }

        // let sumOfMoneySpend = 0
        // let counter = 0

        // for (let key in expObj) {
        //     sumOfMoneySpend += Math.trunc(expObj[key])
        //     counter += 1
        // }

        // let counterGrapch = 1
        // const expArraGraph = []

        // for (let key in expObj) {
        //     const expObjGraph = {}
        //     expObjGraph["x"] = counterGrapch
        //     expObjGraph["y"] = Math.trunc(expObj[key] - (sumOfMoneySpend / counter))
        //     expObjGraph["z"] = key
        //     expArraGraph.push(expObjGraph)
        //     counterGrapch += 1
        // }

        // setGraphData(expArraGraph)

        let sumOfMoneySpend = 0
        let counter = 0 // # of ppl in group? usersInTrip.length?

        for (let key in expObj) {
            sumOfMoneySpend += Math.trunc(expObj[key])
            counter += 1
        }

        const expArraGraph = []

        for (let key in expObj) {
            let money = Math.trunc(expObj[key] - (sumOfMoneySpend / counter))
            if (key === userData.username) {
                const expObjGraph = {
                    x: 0,
                    y: money,
                    label: [key + " (You)", " ¥ " + money]
                }
                expArraGraph.push(expObjGraph)

            }
            else {
                const expObjGraph = {
                    x: 0,
                    y: money,
                    label: [key, " ¥ " + money]
                }
                expArraGraph.push(expObjGraph)
            }
            // if (money < 0) {
            //     expObjGraph["label"] = `${key} -¥${-1*money}`
            // } else {
            //     expObjGraph["label"] = `¥${money} ${key}`
            // }
            // counterGrapch += 1
        }
        // console.log(expArraGraph);

        setGraphData(expArraGraph)


    }, [expData])

    const Separator = () => <View style={styles.separator} />;



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


            someoneOwnsYou.push(
                <Card style={styles.card}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", alignSelf: "center" }}>
                        {sortedPeople[i] === userData.username ? <Text style={styles.oweCalc}>{sortedPeople[i]} (You) owes</Text> : <Text style={styles.oweCalc}>{sortedPeople[i]} owes</Text>}
                        <View>
                            <MaterialCommunityIcons name="transfer-right" size={100} style={{ color: "#FF6865" }} />
                            <Text style={[styles.oweCalc, { textAlign: "center" }]}>¥{Math.trunc(debt)}</Text>
                        </View>
                        {sortedPeople[j] === userData.username ? <Text style={styles.oweCalc}> to {sortedPeople[j]} (You)</Text> : <Text style={styles.oweCalc}> to {sortedPeople[j]}</Text>}
                    </View>
                    {/* {sortedPeople[i] === userData.username ? <Text style={styles.oweCalc}>{sortedPeople[i]} (You)</Text> : <Text style={styles.oweCalc}>{sortedPeople[i]}</Text>}
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                    <MaterialCommunityIcons name="arrow-right-thin" size={100} style={{ marginRight: 10, color: "red" }} />
                        <Text style={[styles.oweCalc]}> owes</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.oweCalc, { textAlign: "left" }]}>¥{Math.trunc(debt)}</Text>
                        </View>
                    </View>
                    {sortedPeople[j] === userData.username ? <Text style={styles.oweCalc}> to {sortedPeople[j]} (You)</Text> : <Text style={styles.oweCalc}> to {sortedPeople[j]}</Text>} */}
                    {sortedPeople[i] === userData.username ?
                        <View>
                            <Separator />
                            <Text style={[styles.oweCalc]}>Payment options</Text>
                            <View style={styles.buttons}>
                                <OpenURLButton url={PayPayURL}>Pay with PayPay</OpenURLButton>
                                <OpenURLButton url={LinePayURL}>Pay with Line Pay</OpenURLButton>
                            </View>
                        </View> : ""}
                </Card>
            );

            if (sortedPeople[i] === userData.username) {
                someoneOwnsYou.unshift(card);
            } else {
                someoneOwnsYou.push(card)
            }

            if (sortedValuesPaid[i] === 0) {
                i++;
            }

            if (sortedValuesPaid[j] === 0) {
                j--;
            }
        }

        result.push(someoneOwnsYou)

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


    return (
        <ScrollView>
            {graphData.length !== 0 ? <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <View style={styles.container}>
                    {usersInTrip.length > 1 && graphData.length !== 0 &&
                        <View>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: "center" }}> Group balance graph </Text>
                            <Text style={{ fontSize: 20, color: "#a9a9a9", textAlign: "center" }}> Take a look at the graph and see who owes money and who is owed </Text>
                        </View>}

                    <View style={styles.legend}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={[styles.SquareShapeView, { backgroundColor: red }]} />
                            <Text> You owe money</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                            <View style={[styles.SquareShapeView, { backgroundColor: green }]} />
                            <Text> You payed more money</Text>
                        </View>
                    </View>

                    {usersInTrip.length > 1 && graphData.length !== 0 &&
                        <VictoryChart
                            padding={{ left: 3, right: 3, }}
                            // domain={{x: -(usersInTrip.length)/2+1, y:(usersInTrip.length)/2-1}}
                            // domain={{ x: [-(usersInTrip.length) / 2 + 1, (usersInTrip.length) / 2 - 1] }}
                            domain={{ x: [-(usersInTrip.length) / 2 + 1, (usersInTrip.length) / 2 - 1] }}
                            style={{
                                flex:1,
                                parent: {
                                    flex: 1,
                                    backgroundColor: blue,
                                    borderRadius: 6,
                                },
                            }}
                            width={380}
                            height={500}
                        >
                            <VictoryGroup
                                offset={300 / usersInTrip.length}
                            >
                                {graphData.map((item) => {
                                    return (
                                        <VictoryBar
                                            horizontal
                                            style={{
                                                data: {
                                                    fill: ({ datum }) => datum.y > 0 ? "#8CEF74" : "#FF6865",
                                                    fillOpacity: 0.7,
                                                    width: () => 250 / usersInTrip.length,
                                                },
                                            }}
                                            cornerRadius={6}

                                            data={[item]}

                                            labelComponent={
                                                <VictoryLabel
                                                    dx={data => {
                                                        let offset = 5;
                                                        if (Number(data.datum.y) >= 0) {
                                                            return - (offset)
                                                        } else {
                                                            return offset
                                                        }
                                                    }}
                                                    textAnchor={({ data }) => {
                                                        if (data[0].y > 0) {
                                                            data[0].label[0]
                                                            return 'end'
                                                        } else {
                                                            return 'start'
                                                        }
                                                    }}
                                                    style={[
                                                        { fill: "#000000", fontSize: 18, },

                                                        {
                                                            fill: ({ data }) => {
                                                                if (data[0].y > 0) {
                                                                    return 'green'
                                                                } else {
                                                                    return 'red'
                                                                }
                                                            }
                                                            , fontSize: 18
                                                        }
                                                    ]}

                                                />
                                            }
                                        />)
                                })}
                            </VictoryGroup>
                            <VictoryAxis
                                style={{
                                    tickLabels: { fill: "none" },
                                    axis: { stroke: primary, strokeWidth: 1, },
                                    // grid: {stroke:'red'},
                                }}
                            />
                        </VictoryChart>
                    }
                    <View>
                        <View style={styles.legend}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={[styles.SquareShapeView, { backgroundColor: 'red' }]} />
                                <Text> You owe money</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                                <View style={[styles.SquareShapeView, { backgroundColor: 'green' }]} />
                                <Text> You payed more money</Text>
                            </View>

                        </View>

                    </View>
                </View>


                <View style={styles.ownsTextBox}>
                    <Text style={styles.ownsText}>Who owns to whom?</Text>
                </View>

                <View style={styles.calcView}>

                    {splitPaymentsData[0].map((item) => {
                        // console.log(item);
                        return (item)
                    })
                    }
                </View>

                {/* <View style={{ height: 100, backgroundColor: primary, }}>
                    <View style={styles.buttons}>
                        <OpenURLButton url={PayPayURL}>Pay with PayPay</OpenURLButton>
                        <OpenURLButton url={LinePayURL}>Pay with Line Pay</OpenURLButton>
                    </View>
                    <AddButton
                        setModalOpen={setModalOpen}
                    />
                </View>
                <StyledModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    AddComponent={AddExpenses}
                /> */}
            </View> : 
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}> No expenses yet </Text>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 5
    },
    buttons: {
        // flex:1,
        width: 300,
        height: 70,
        flexDirection: 'row',
        // backgroundColor: pink,
        // position: "absolute",
        bottom: 15,
        overflow: 'visible',
        // padding:5

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
        backgroundColor: "#d3d3d3",
    },
    ownsTextBox: {
        height: 50,
        backgroundColor: "#d3d3d3",
        alignContent: "center",
    },
    ownsText: {
        alignSelf: "center",
        paddingTop: 10,
        fontSize: 20,
    },
    card: {
        paddingTop: 10,
        marginTop: 20,
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#9E9E9E',
        borderBottomWidth: 0.5,
        width: "90%",
        alignSelf: "center",
    },
    SquareShapeView: {
        width: 10,
        height: 10,
        backgroundColor: '#00BCD4',
        marginTop: 5,

    },
    legend: {
        width: "100%",
        flexDirection: 'row',
        // backgroundColor: pink,
        // position: "absolute",
        // overflow: 'visible',
        // padding:5
    }
});