import React, { useContext, useEffect, useState } from 'react'
import { Image, ImageBackground, Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import {StyledModal} from "../styles/globalStyles";

import { AuthContext } from '../context/AuthContext'

import EditUserInfo from './EditUserInfo'
import EditPassword from './EditPassword';

export default function UserPage({ }) {
    const { userData, editUser } = useContext(AuthContext)

    const [editInfoModal, setEditInfoModal] = useState(false)
    const [editPasswordModal, setEditPasswordModal] = useState(false)


    const Separator = () => <View style={styles.separator} />;


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ImageBackground
                    style={styles.headerBackgroundImage}
                    blurRadius={10}
                    source={{ uri: "https://media.istockphoto.com/id/1311084168/photo/overjoyed-pretty-asian-woman-look-at-camera-with-sincere-laughter.jpg?b=1&s=170667a&w=0&k=20&c=XPuGhP9YyCWquTGT-tUFk6TwI-HZfOr1jNkehKQ17g0=" }}
                >
                    <View style={styles.headerColumn}>
                        <Image
                            style={styles.userImage}
                            source={{ uri: "https://media.istockphoto.com/id/1311084168/photo/overjoyed-pretty-asian-woman-look-at-camera-with-sincere-laughter.jpg?b=1&s=170667a&w=0&k=20&c=XPuGhP9YyCWquTGT-tUFk6TwI-HZfOr1jNkehKQ17g0=" }}
                        />
                        <Text style={styles.userNameText}>{userData.username}</Text>
                    </View>
                </ImageBackground>
            </View>
            <View>
                <Text style={styles.titleText}>
                    {"Username:"}
                </Text>
                <Text style={styles.userInfo}>
                    {userData.username}
                </Text>
                <Separator />
                <Text style={styles.titleText}>
                    {"Email:"}
                </Text>
                <Text style={styles.userInfo}>
                    {userData.email}
                </Text>
                <Separator />
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: '#fff', fontSize: 18 }} onPress={() => setEditInfoModal(true)}>Edit profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={{ color: '#fff', fontSize: 18 }} onPress={() => setEditPasswordModal(true)}>Edit password</Text>
                </TouchableOpacity>
            </View>
            <StyledModal
                modalOpen={editInfoModal}
                setModalOpen={setEditInfoModal}
                AddComponent={EditUserInfo}
                EditData={userData}
            />
            <StyledModal
                modalOpen={editPasswordModal}
                setModalOpen={setEditPasswordModal}
                AddComponent={EditPassword}
                EditData={userData}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E5EFF9",//used to be '#fff'
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 45,
    },
    buttonsContainer: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "70%",
        alignSelf: "center",
    },
    button: {
        backgroundColor: '#147EFB',
        borderRadius: 5,
        padding: 10,
    },
    headerContainer: {
        marginBottom: 35,
    },
    headerColumn: {
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                alignItems: 'center',
                elevation: 1,
                marginTop: -1,
            },
            android: {
                alignItems: 'center',
            },
        }),
    },
    userImage: {
        borderColor: '#FFF',
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
    },
    userNameText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: 1,
        width: "90%",
        alignSelf: "center",
    },
    titleText: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        marginLeft: 20,
    },
    userInfo: {
        marginTop: 10,
        fontSize: 18,
        paddingBottom: 8,
        marginLeft: 20,
    }
})