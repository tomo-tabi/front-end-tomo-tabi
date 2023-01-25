import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity ,StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors, MyTextInput, BlueButton, Line } from "../styles/globalStyles";
const { primary, lightBlue, grey } = colors;


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
      <View style={[styles.flexRow,{alignItems:'center'}]}>
        <Text style={[styles.memberList]}>{item.username}</Text>
        <Text style={[styles.status, styles[item.status]]}>{status}</Text>
      </View>
    )
  }

  const seperator = () => {
    return <Line style={{backgroundColor:grey, marginVertical:0, marginHorizontal:5}}/>
  }

  return (
    <View style={[globalStyles.container,{backgroundColor: primary}]}>

      <View style={[globalStyles.header,styles.headerExtra,styles.flexRow]}>
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

      <Text style={[globalStyles.header,styles.headerExtra]}>Invite Status</Text>
      <View style={{maxHeight:"50%"}}>
      <FlatList
        keyExtractor={(item) => item.email}
        data={dummyObj}
        renderItem={renderInvite}
        ItemSeparatorComponent={seperator}
      />
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
        renderItem={renderMember}
        ItemSeparatorComponent={seperator}
      />

      
    </View>
  )
};

const opacity = 0.2;

const statColor = {
  pending:'rgb(255, 191, 0)',
  pendingLight:`rgba(255, 191, 0, ${opacity})`,
  rejected:'rgb(210, 34, 45)',
  rejectedLight:`rgba(210, 34, 45, ${opacity})`
}

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
  flexRow:{
    flexDirection:'row',
    alignContent:'space-between', 
    justifyContent:'space-between' 
  },
  memberList: {
    fontSize:17,
    marginLeft:10,
    flex: 1,
    height: 40,
    textAlignVertical:'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  status:{
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
    color:statColor.pending,
    borderColor:statColor.pending,
    backgroundColor:statColor.pendingLight
  },
  rejected:{
    color:statColor.rejected,
    borderColor:statColor.rejected,
    backgroundColor:statColor.rejectedLight
  }
});
