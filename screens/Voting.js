import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors, Seperator, YesOrNoCard } from "../styles/globalStyles"
const { primary, grey } = colors

export default function Voting({ route }) {
  // fucntion to naviagte to Voting (from timeline?)
  const pressHandler = (eventName) => {
    navigation.navigate('Voting',{
      eventName: eventName
    })
  } 
  // for Trip invite view
  // <YesOrNoCard
  //   propmt={<View style={{paddingHorizontal: 5}}>
  //   <Text style={styles.inviteText}>User '{item.username}' has invited you trip:</Text>
  //   <Text style={styles.inviteTripName}>{item.name}</Text>
  // </View>}

  const eventName = route.eventName || "Randome Event";

  const dummyObj = [
    {"username": "user1", "status": "accepted"},
    {"username": "user2", "status": "rejected"},
    {"username": "user3", "status": "rejected"},
  ]

  // API_URL/vote/yes/:eventid
  // API_URL/vote/no/:eventid

  // this screen is voting detail view
  const renderItem = ({ item }) => {
    
    let status;
    if (item.status === "accepted") {
      status = <MaterialCommunityIcons name="check" size={20}/>;
    } else {
      status = <MaterialCommunityIcons name="window-close" size={20}/>
    }
    return (
      <View style={[globalStyles.flexRow,{alignItems:'center',}]}>
        <Text style={[styles.memberList]}>{item.username}</Text>
        <Text style={[styles.status, globalStyles[item.status], {backgroundColor:0}]}>{status}</Text>
      </View>
    )
  }


  //Voting short view
  // next to event 
  //Voting detail view
  // if user Voted show voting status of who voted yes/no
  // else also show user to vote
  return (
    <View style={globalStyles.container}>
      <YesOrNoCard
        propmt={
          <Text style={styles.questionText}>Will you be attending {eventName}?</Text>
        }
        //need to add yesFunc, noFunc
      />

      <View>
        <FlatList
          keyExtractor={(item, i) => i}
          data={dummyObj}
          renderItem={renderItem}
          style={globalStyles.card}
          ItemSeparatorComponent={()=><Seperator/>}
        />
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

  status:{//almost same as invite.js
    borderRadius:20,
    borderWidth:1.5,
    marginRight:5,
    fontSize:17,
    textAlignVertical:'center',
    textAlign:'center',

    color:primary,
    padding:1.5
  },
  
})

