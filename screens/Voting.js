import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors, Seperator, YesOrNoCard } from "../styles/globalStyles"
const { primary, grey } = colors

import { VoteContext } from "../context/VoteContext";
import { TripContext } from '../context/TripContext';
import { AuthContext } from "../context/AuthContext";

export default function Voting({ route, navigation }) {
  const { userData } = useContext(AuthContext);
  const { votes, userVote, getVotes, getUserVote, postYesVote, postNoVote, updateYesVote, updateNoVote } = useContext(VoteContext);
  const { usersInTrip } = useContext(TripContext);

  const [ voteInfo, setVoteInfo ] = useState(null);
  const [ editOpen, seteditOpen ] = useState(false);

  const eventName = route.params.eventName || "Random Event";
  const eventid = route.params.eventid;

  useEffect(() => {
    getVotes(eventid);
    getUserVote(eventid);
  },[])

  useEffect(() => {
    
    if (votes !== null) {
      const userVoteStat = {};
      let noVote = [];
      
      votes.voteArray.forEach((item) => {
        return userVoteStat[item.email] = 0
      });

      usersInTrip.forEach((obj) => {
        if(userVoteStat[obj.email] === undefined){
          noVote.push(obj)
        }
      });

      let res = [...votes.voteArray, ...noVote];
      setVoteInfo(res);
      
    } else {//no votes at all
      setVoteInfo(usersInTrip);
    }

    
  },[votes, userVote])


  // this screen is voting detail view
  const renderItem = ({ item }) => {
    
    let status, vote;

    if(item.vote === undefined) {
      vote = <MaterialCommunityIcons name="dots-horizontal" size={20}/>;
      status = "pending";
    }

    if (item.vote) {
      vote = <MaterialCommunityIcons name="check" size={20}/>;
      status = "accepted";
    } else if (item.vote === false) {
      vote = <MaterialCommunityIcons name="window-close" size={20}/>
      status = "rejected";
    } 

    return (
      <View style={[globalStyles.flexRow,{alignItems:'center',}]}>
        <Text style={[styles.memberList]}>{item.username}</Text>
        { item.username === userData.username && status !== 'pending' ? 
          <TouchableOpacity 
            style={[globalStyles.status, globalStyles[status], {backgroundColor:0}]}
            onPress={() => seteditOpen(true)}
          >
            <Text style={[globalStyles[status],{backgroundColor:0}]}>
            {vote}
            </Text>
          </TouchableOpacity>

          :<Text style={[globalStyles.status, globalStyles[status], {backgroundColor:0}]}>{vote}</Text>
        }
      </View>
    )
  } 

  return (
    <View style={globalStyles.container}>

      {
        (userVote && userVote[0]["vote"] !== null)  ? 
        ""
        :<YesOrNoCard
          propmt={
            <Text style={styles.questionText}>Will you be attending {eventName}?</Text>
          }
          yesFunc={() => postYesVote(eventid)}
          noFunc={() => postNoVote(eventid)}
        />
      }
      {
        editOpen ? 
        <YesOrNoCard
        propmt={
          <Text style={styles.questionText}>Will you be attending {eventName}?</Text>
        }
        yesFunc={() => { 
          if(!userVote[0]['vote']){
            updateYesVote(eventid, userVote[0]['id']); 
          }
          seteditOpen(false); 
        }}
        noFunc={() => { 
          if(userVote[0]['vote']){
            updateNoVote(eventid, userVote[0]['id']); 
          }
          seteditOpen(false); 
        }}
        />
        :''
      }


      <View>
        {voteInfo ?
        <FlatList
          keyExtractor={(item, i) => i}
          data={voteInfo}
          renderItem={renderItem}
          style={globalStyles.card}
          ItemSeparatorComponent={()=><Seperator/>}
        />
        :""
        }
      </View>

    </View>
  )
};

const styles = StyleSheet.create({
  questionText:{
    textAlign:'center',
    fontSize:30,
  },

  memberList:{//almost same as invite.js
    fontSize:17,
    marginLeft:5,
    flex: 1,
    // height: 40,
    textAlignVertical:'center',
    marginBottom:1,
    padding:5
    // borderWidth: 1,
    // borderColor: 'black',
  },
  
})

