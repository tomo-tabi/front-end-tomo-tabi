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
  const { postInvite, getInvitesSent, invitesSent } = useContext(InviteContext);
  const { tripid } = useContext(EventContext);
  const { getUsersInTrip, usersInTrip } = useContext(TripContext);

  const [ show, setShow ] = useState(false);
  const [ noInvitesSent, setNoInvitesSent ] = useState(false);

  useEffect(() => {
    getUsersInTrip(tripid);
    getInvitesSent();
  },[])



  useEffect(() => {
    // console.log("💄",invitesSent, show, noInvitesSent);
    if (invitesSent) {// user sent invite before
      setShow(false);
      setNoInvitesSent(false);
    } else {
      setShow(true);
      setNoInvitesSent(true);
    }
    // what should I do if user never sent invite but there is more than 1 member in trip?

    if (Array.isArray(invitesSent)) { 
      let pending = invitesSent.filter((invite) => invite.status !== 'accepted');
      setPendingInvites(pending);
    }

  },[invitesSent])

  const renderMember = ({ item }) => {
    return (
      <Text style={[styles.memberList]}>{item.username}</Text>
    )
  }

  // const dummyObj = [
  //   {"email": "user1@test.com", "username": "user1", "status": "pending"},
  //   {"email": "user2@test.com", "username": "user2", "status": "rejected"}
  // ]

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

      {
        noInvitesSent ? 
        <Text style={styles.noInviteText}>
          You have not sent any invites yet! {'\n'}
          Start sending invitations to plan the trip together
        </Text> 
        :""
      }

      <View style={[globalStyles.header,styles.headerExtra,globalStyles.flexRow]}>
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
      { Array.isArray(invitesSent) && !invitesSent.find((item) => item.status === 'accepted') ? 
        <>
          <Text style={[globalStyles.header,styles.headerExtra]}>Invite Status</Text>
          <View style={{maxHeight:"50%"}}>
            <FlatList
              keyExtractor={(item, index) => index}
              data={invitesSent}
              renderItem={renderInvite}
              ItemSeparatorComponent={<Seperator/>}
            />
          </View>
        </>
        :''
      }

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
  noInviteText:{
    textAlign:'center', 
    fontSize:15, 
    marginVertical:10,
    marginBottom:20
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
