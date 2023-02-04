import React, { useContext, useEffect, useState } from 'react';
import Dialog from "react-native-dialog";
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors, MyTextInput, BlueButton, Seperator, StatusColor } from "../styles/globalStyles";
const { primary, lightBlue, grey } = colors;
const { pendingLight, rejectedLight } = StatusColor


import { Formik } from 'formik';

import { InviteContext } from '../context/InviteContext';
import { TripContext } from '../context/TripContext';
import { EventContext } from '../context/EventContext';

export default function Invite() {
  const { postInvite, getInvitesSent, invitesSent, deleteInviteSent } = useContext(InviteContext);
  const { tripid } = useContext(EventContext);
  const { usersInTrip, permission, owner, lockTrip, unlockTrip } = useContext(TripContext);

  const [show, setShow] = useState(false);
  const [pendingInvites, setPendingInvites] = useState(null);
  const [noInvitesSent, setNoInvitesSent] = useState(true);//default: no invites sent
  const [showDialog, setShowDialog] = useState(false);
  const [inviteid, setInviteid] = useState(null);
  const [lockVisible, setLockVisible] = useState(false);
  const [unlockVisible, setUnlockVisible] = useState(false);

  useEffect(() => {
    getInvitesSent();
  }, [])

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
  }, [invitesSent])



  const renderMember = ({ item }) => {
    return (
      <Text style={[styles.memberList]}>{item.username}</Text>
    )
  }

  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleDelete = () => {
    // console.log(deleteInviteSent);
    deleteInviteSent(inviteid);
    setShowDialog(false);
  };

  const handleLock = (info) => {
    console.log("lock");
    lockTrip(info);
    setLockVisible(true);
  }

  const handleUnlock = (info) => {
    console.log("unLock");
    unlockTrip(info);
    setUnlockVisible(true);

  }

  const hideLockedDialog = () => {
    setLockVisible(false);
  }

  const hideUnlockedDialog = () => {
    setUnlockVisible(false);
  }
  // console.log(owner)
  // console.log(tripid);

  const renderInvite = ({ item }) => {

    let status = (item.status).charAt(0).toUpperCase() + (item.status).slice(1);
    let color = item.status === 'pending' ? pendingLight : rejectedLight;

    return (
      <View style={[globalStyles.flexRow, { alignItems: 'center' }]}>
        <Text style={[styles.memberList]}>{item.username}</Text>
        {item.status === "rejected" ?
          <TouchableOpacity onPress={() => { setInviteid(item.id); setShowDialog(true); }}>
            <Text style={[globalStyles.status, globalStyles[item.status], { width: 90, height: 27, backgroundColor: color }]}>{status}</Text>
          </TouchableOpacity>
          : <Text style={[globalStyles.status, globalStyles[item.status], { width: 90, height: 27, backgroundColor: color }]}>{status}</Text>
        }
      </View>
    )
  }

  return (
    <View style={[globalStyles.container, { backgroundColor: primary }]}>

      <Dialog.Container visible={showDialog}>
        <Dialog.Title>Delete Invite Sent</Dialog.Title>
        <Dialog.Description>
          Do you want to delete this invite? You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Delete" onPress={handleDelete} />
      </Dialog.Container>

      

      {permission ?
        null
        :
        <View style={[globalStyles.header, styles.headerExtra, globalStyles.flexRow]}>
          <Text style={[globalStyles.header, { paddingVertical: 0 }]}>Send Invite</Text>
          <TouchableOpacity onPress={() => setShow(!show)}>
            <MaterialCommunityIcons name={show ? 'chevron-up' : 'chevron-down'} size={30} />
          </TouchableOpacity>
        </View>}
      {
        noInvitesSent ?
          <Text style={styles.noInviteText}>
            You have not sent any invites yet! {'\n'}
            Start sending invitations to plan the trip together
          </Text>
          : ""
      }



      {show ?

        <View style={styles.formik}>
          <Formik
            initialValues={{ email: '' }}
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
      {Array.isArray(pendingInvites) && pendingInvites.length !== 0 ?
        <>
          <Text style={[globalStyles.header, styles.headerExtra]}>Invite Status</Text>
          <View style={{ maxHeight: "50%", marginBottom: 5 }}>
            <FlatList
              keyExtractor={(item, index) => index}
              data={pendingInvites}
              renderItem={renderInvite}
              ItemSeparatorComponent={<Seperator />}
            />
          </View>
        </>
        : ''
      }

      <Text style={[globalStyles.header, styles.headerExtra]}>Members</Text>
      <FlatList
        keyExtractor={(item) => item.email}
        data={usersInTrip}
        renderItem={renderMember}
        ItemSeparatorComponent={<Seperator />}
      />

      {owner ?
        <View style={styles.buttonContainer}>
          <BlueButton
            onPress={ () => {handleLock(tripid)}}
            buttonText="Lock your trip"
            style={styles.button}
          />
          <BlueButton
            onPress={ () => {handleUnlock(tripid)}}
            buttonText="Unlock your trip"
            style={styles.button}
          /> 
        </View>
        : ''
      }

      <View>
        <Dialog.Container visible={lockVisible}>
          <Dialog.Title style={styles.lockDialogTitle}>Locked your trip!</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Nobody can edit the trip now!
          </Dialog.Description>
          <Dialog.Button label="OK" style={styles.dialogButton} onPress={hideLockedDialog}/>
        </Dialog.Container>
      </View>

      <View>
        <Dialog.Container visible={unlockVisible}>
          <Dialog.Title style={styles.unlockDialogTitle}>Unlocked your trip!</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            everybody can edit the trip now!
          </Dialog.Description>
          <Dialog.Button label="OK" style={styles.dialogButton} onPress={hideUnlockedDialog}/>
        </Dialog.Container>
      </View>
      
      
    </View>
  )
};

const styles = StyleSheet.create({
  headerExtra: {
    padding: 5,
    backgroundColor: lightBlue,
    borderRadius: 6,
  },
  formik: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  noInviteText: {
    textAlign: 'center',
    fontSize: 15,
    marginVertical: 10,
    marginBottom: 20
  },

  memberList: {//almost same as voteing.js
    fontSize: 17,
    marginLeft: 10,
    flex: 1,
    height: 40,
    textAlignVertical: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  button: {
    width: '45%',
    marginHorizontal: 10,
  },

  lockDialogTitle: {
    fontSize: 25,
    color: "#a52a2a"
  },

  unlockDialogTitle: {
    fontSize: 25,
    color: "darkcyan"
  },
  dialogDescription: {
    fontWeight: 'bold', 
    color: 'goldenrod'
  },
  dialogButton: {
    fontWeight: 'bold'
  },
});
