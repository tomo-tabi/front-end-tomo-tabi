import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity ,StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors, MyTextInput, BlueButton, Seperator, status } from "../styles/globalStyles";
const { primary, lightBlue, grey } = colors;
const { pending, pendingLight, rejected, rejectedLight } = status


import { Formik } from 'formik';

import { InviteContext } from '../context/InviteContext';
import { TripContext } from '../context/TripContext';
import { EventContext } from '../context/EventContext';

export default function Invite() {
  const { postInvite } = useContext(InviteContext);
  const { tripid } = useContext(EventContext);
  const { getUsersInTrip, usersInTrip } = useContext(TripContext);

  const [ show, setShow ] = useState(false);

  useEffect(() => {
    getUsersInTrip(tripid)
  },[])

  // console.log("💄",usersInTrip);

  useEffect(() => {
    if (Array.isArray(usersInTrip)) {
      if (usersInTrip.length <= 1) {
        // console.log("true??",usersInTrip.length);
        setShow(true);
      } else if (usersInTrip.length > 1) {
        setShow(false);
      }
    }
  },[usersInTrip])

  

  const renderMember = ({ item }) => {
    return (
      <Text style={[styles.memberList]}>{item.username}</Text>
    )
  }

  const dummyObj = [
    {"email": "user1@test.com", "username": "user1", "status": "pending"},
    {"email": "user2@test.com", "username": "user2", "status": "rejected"}
  ]

  const renderInvite = ({ item }) => {
    
    let status;
    if (item.status === "pending") {
      status = <Text>  Pending  </Text>
    } else if (item.status === "rejected") {
      status = <Text>  Rejected  </Text>
    } else {
      return
    }
    return (
      <View style={[globalStyles.flexRow,{alignItems:'center'}]}>
        <Text style={[styles.memberList]}>{item.username}</Text>
        <Text style={[styles.status, styles[item.status]]}>{status}</Text>
      </View>
    )
  }

  return (
    <View style={[globalStyles.container,{backgroundColor: primary}]}>

      <View style={[globalStyles.header,styles.headerExtra,globalStyles.flexRow]}>
        <Text style={[globalStyles.header, {paddingVertical:0}]}>Send Invite</Text>
        <TouchableOpacity onPress={()=> setShow(!show)}>
          <MaterialCommunityIcons name={show ? 'chevron-up' : 'chevron-down'} size={30}/>
        </TouchableOpacity>
      </View>

      {/* if invitesSent.length === 0 && only 1 trip member don't display Invite Status, display message */}
      {/* <Text>
        You have not sent any invites yet! 
        Start sending invitations to plan the trip together
      </Text> */}

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
      <Text style={[globalStyles.header,styles.headerExtra]}>Invite Status</Text>
      <View style={{maxHeight:"50%"}}>
        <FlatList
          keyExtractor={(item) => item.email}
          data={dummyObj}
          renderItem={renderInvite}
          ItemSeparatorComponent={<Seperator/>}
        />
      </View>

      <Text style={[globalStyles.header,styles.headerExtra]}>Members</Text>
      <FlatList
        keyExtractor={(item) => item.email}
        data={usersInTrip}
        renderItem={renderMember}
        ItemSeparatorComponent={<Seperator/>}
      />

      
    </View>
  )
};

const opacity = 0.2;



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

  memberList: {//almost same as voteing.js
    fontSize:17,
    marginLeft:10,
    flex: 1,
    height: 40,
    textAlignVertical:'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  status:{//almost same as voteing.js
    borderRadius:20,
    borderWidth:1.5,
    marginRight:5,
    fontSize:17,
    textAlignVertical:'center',
    textAlign:'center',

    width:90,
    height:27,
  },
  pending:{
    color: pending,
    borderColor: pending,
    backgroundColor: pendingLight
  },
  rejected:{
    color: rejected,
    borderColor: rejected,
    backgroundColor: rejectedLight
  }
});
