import React, { useContext, useState } from 'react'
import { Image, ImageBackground, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledModal, colors, globalStyles, BlueButton } from "../styles/globalStyles";
const { yellow, lightBlue, blue } = colors

import { AuthContext } from '../context/AuthContext'

import EditUserInfo from './EditUserInfo'
import EditPassword from './EditPassword';

export default function UserPage({ }) {
    const { logout, userData } = useContext(AuthContext)

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
                        <Text style={styles.userInfo}>
                            {userData.email}
                        </Text>
                    </View>
                </ImageBackground>
            </View>
 
            <View style={[globalStyles.card, styles.buttonsContainer]}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setEditInfoModal(true)}
                >
                    <MaterialCommunityIcons name='pencil' size={30} style={{ marginRight:10, color:yellow }}/>
                    <Text style={{ textAlignVertical:'center',fontSize: 18}}>
                        Edit Profile
                    </Text>
                </TouchableOpacity>
                <Separator/>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setEditPasswordModal(true)}
                >
                    <MaterialCommunityIcons name='lock' size={30} style={{ marginRight:10, color:blue }}/>
                    <Text style={{ textAlignVertical:'center',fontSize: 18}}>
                        Edit Password
                    </Text>
                </TouchableOpacity>
            </View>
            <BlueButton
                onPress={() => logout()}
                buttonText="Logout"
                style={{ padding: 8, marginHorizontal:10, marginTop:10 }}
            />
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
        backgroundColor: lightBlue,
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 45,
    },
    buttonsContainer: {
        marginTop: 25,
        marginHorizontal:10,
    },
    button: {
        flexDirection:'row', 
        paddingVertical:5,
    },
    headerContainer: {
        marginBottom: 85,
    },
    headerColumn: {
        backgroundColor: 'transparent',
        marginBottom:-120,
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
        borderRadius: 85,
        height: 150,
        width: 150,
    },
    userNameText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#9E9E9E',
        borderBottomWidth: 0.5,
        width: "110%",
        alignSelf: "center",
    },
    titleText: {
        fontSize: 18,
        color:'#737373',
        textAlignVertical:'center',
        justifyContent:'center',

    },
    userInfo: {
        fontSize: 15,
        fontWeight: 'bold',
        color:'#9E9E9E',
    }
})