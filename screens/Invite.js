import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity ,StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors, MyTextInput, BlueButton } from "../styles/globalStyles";
const { primary, lightBlue, grey } = colors;

import { Formik } from 'formik';

import { InviteContext } from '../context/InviteContext';
import { TripContext } from '../context/TripContext';
import { EventContext } from '../context/EventContext';

export default function Invite() {
  const { postInvite } = useContext(InviteContext);
  const { tripid } = useContext(EventContext);
  const { getUsersInTrip, usersInTrip } = useContext(TripContext);

  const [ show, setShow ] = useState(false)

  useEffect(() => {
    getUsersInTrip(tripid)
  },[])

  useEffect(() => {
    if (usersInTrip) {
      if (usersInTrip.length <= 1) {
        setShow(true)
      }
    }
  },[])

  console.log(usersInTrip);

  const renderItem = ({ item }) => {
    return (
      <Text style={styles.memberList}>{item.username}</Text>
    )
  }

  return (
    <View style={[globalStyles.container,{backgroundColor: primary}]}>

      <View style={[globalStyles.header,styles.headerExtra,{flexDirection:'row',alignContent:'space-between', justifyContent:'space-between'}]}>
        <Text style={[globalStyles.header, {paddingVertical:0}]}>Send Invite</Text>
        <TouchableOpacity onPress={()=> setShow(!show)}>
          <MaterialCommunityIcons name={show ? 'chevron-up' : 'chevron-down'} size={30}/>
        </TouchableOpacity>
      </View>
      

      {show ? 

      <View style={styles.formik}>
        <Formik
          initialValues={{ email: ''}}
          onSubmit={(values, actions) => {
            actions.resetForm();
            postInvite(values);
          }}
        >
          {(props) => (
            <>
              <MyTextInput
                label="User Email"
                icon="account-plus-outline"
                placeholder="abc@gmail.com"
                onChangeText={props.handleChange('email')}
                value={props.values.email}
              />

              <BlueButton
                onPress={props.handleSubmit}
                buttonText="Send Invite"
              />
            </>
          )}
        </Formik>
      
      </View>
      : ""
      }
      <Text style={[globalStyles.header,styles.headerExtra]}>Members</Text>
      <FlatList
        keyExtractor={(item) => item.email}
        data={usersInTrip}
        renderItem={renderItem}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  headerExtra: {
    padding:5,
    backgroundColor:lightBlue,
    borderRadius:6,
  },
  formik:{
    marginBottom:10,
    paddingHorizontal:10,
  },
  memberList: {
    fontSize:20,
    marginLeft:10,
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: grey
  }
});
