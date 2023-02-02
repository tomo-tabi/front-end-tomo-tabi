import styled from 'styled-components';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Modal } from "react-native";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';

export const colors = {
  primary:"#ffffff",
  pink:"#F187A4",
  blue:"#9CCAEC",
  yellow:"#FECE76",
  lightBlue:"#E5EFF9",
  navy:"#1F2937",
  grey:"#E5E7EB",
  greyBlue:"#6692B3",
}

export const accOrRej = {
  accepted:'rgba(35, 136, 35, 0.8)',
  rejected:'rgba(210, 34, 45, 0.8)',
}

export const StatusColor = {
  accepted:'rgb(35, 136, 35)',
  acceptedLight:'rgba(35, 136, 35, 0.8)',
  pending:'rgb(255, 191, 0)',
  pendingLight:`rgba(255, 191, 0, 0.2)`,
  rejected:'rgb(210, 34, 45)',
  rejectedLight:`rgba(210, 34, 45, 0.2)`
}


const { primary, pink, blue, yellow, lightBlue, navy, grey, greyBlue } = colors
const { accepted, rejected } = accOrRej
const { pending } = StatusColor

// import { globalStyles, SubmitText, MyTextInput } from "../styles/globalStyles";
//globalStyles.addIconButton
export const globalStyles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: lightBlue,//used to be '#fff'
    paddingHorizontal: 10,
    paddingTop:10,
  },

  addIconButton:{//iconContainer
    alignItems:"center",
    alignSelf:"flex-end",
    backgroundColor: yellow,
    borderRadius: 40,
    justiftyContent:"center",
    margin:5,
    marginRight:15,
    
    height:70,
    width:70,
    
    position:"absolute",
    right:0,
    bottom:10,

    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 7,
  },
  timelineAdd:{
    alignSelf:"center",
    backgroundColor: yellow,
    borderRadius: 40,
    marginBottom:25,
    padding:5,

    borderWidth:5, 
    borderColor:primary,
    
    height:70,
    width:70,

  },
  buttonStyle:{ //blue button
    backgroundColor: blue, 
    // justiftyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 3,
    padding: 18,
    paddingHorizontal: 10,
    // flex:1,
  },
  temp:{
    backgroundColor: yellow,
    borderRadius: 6,
    alignContent:"space-around",
    paddingVertical:10,
    // paddingTop:1,

    marginHorizontal: 5,
    marginVertical:10,
    
    // textAlign:'center',
    // borderWidth:1,
    // borderColor:'black',

  },
  header: {
    paddingVertical:10,
    marginBottom: 5,
    fontWeight:'bold',
    // includeFontPadding:false,
    fontSize:20,
    // borderWidth:1,
    // borderColor:'black'
  },
  buttonText:{
    fontSize:16,
    color:primary
  },
  textInput:{
    flexDirection:'row',
    alignItems:'center',
    padding: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 60,
    marginVertical: 3,
    marginBottom: 10,
    backgroundColor: grey,
    fontSize:16,
  },
  textInputText:{
    color: navy,//input text color?
    marginLeft:14,
    fontSize:16,
  },
  modalContent:{
    flex:1,
    backgroundColor:primary,
    // margin:5,
  },
  modalToggle:{
    margin:10,
    alignSelf:"flex-end",
    color:'#fff',
  },
  modalClose:{
    margin:5,
    color:'black'
  },

  flexRow:{//align two items on each end of row
    flexDirection:'row',
    alignContent:'space-between', 
    justifyContent:'space-between',
  },

  //for yes or no card
  accepted:{
    color:accepted,
    borderColor:accepted,
    backgroundColor:accepted,
  },
  rejected:{
    color:rejected,
    borderColor:rejected,
    backgroundColor:rejected
  },
  pending:{
    color:pending,
    borderColor:pending,
    backgroundColor:pending
  },
  button:{
    margin:10,
    flex:0.8,
    borderRadius:20,
    padding:2,
    alignItems:'center'
  },
  card:{
    backgroundColor:primary,
    borderRadius:6,
    overflow:'hidden',
    marginBottom:10,
    
    padding: 5,
    shadowColor: 'grey',
    shadowOpacity: 0.8,
    elevation: 7,
  },
  status:{//almost same as invite.js
    borderRadius:20,
    borderWidth:1.5,
    marginRight:5,
    fontSize:17,
    textAlignVertical:'center',
    textAlign:'center',

    padding:1.5
  },
});


export const Seperator = () => {
  // console.log(style);
  return (
    <View style={{
      backgroundColor:grey,
      height:1
    }}></View>
  )
}

const darkLight = "#9CA3AF";

export const MyTextInput = ( { label, icon, ...props }) => {
  
  let containerStyles = props.multiline ? [globalStyles.textInput,{alignItems:'flex-start', height:undefined}] : globalStyles.textInput;
  
  let textStyles = props.multiline ? [globalStyles.textInputText,{textAlignVertical:"top", paddingTop: 5, width: 310 }] : globalStyles.textInputText;

  const touchRef = useRef();
  return (
      <View>
        <Text>{label}</Text>
        <TouchableOpacity 
          onPress={() => {touchRef.current.focus()}}
          style={containerStyles}
        >
          <MaterialCommunityIcons name={icon} size={30}/>
          <TextInput ref={touchRef} style={textStyles} 
            placeholderTextColor={darkLight}
            {...props}
          />
        </TouchableOpacity>
      </View>
  );
};

export const PasswordTextInput = ( { text, hidePassword, setHidePassword, ...props }) => {
  const touchRef = useRef();
  return (
      <View>
        <Text>{text}</Text>
        <TouchableOpacity 
            onPress={() => {touchRef.current.focus()}}
            style={globalStyles.textInput}
          >
            <MaterialCommunityIcons name='lock-outline' size={30} />
            <TextInput style={globalStyles.textInputText}
              ref={touchRef}
              placeholder="Password"
              placeholderTextColor={darkLight}
              {...props}
            />
          <TouchableOpacity 
            onPress={() => setHidePassword(!hidePassword)}
            style={{
              // elevation:1,
              position:'absolute',
              right:10,
              borderWidth:0

              // top:35,
            }}
          >
            <MaterialCommunityIcons 
              name={hidePassword ? "eye-off-outline" : "eye-outline"} 
              size={30} 
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
  );
};

export const YesOrNoCard = ({ propmt, yesFunc, noFunc }) => {
  // console.log(propmt);
  return (
    <View style={globalStyles.card}>
      {propmt}
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity style={[globalStyles.button, globalStyles.accepted]}
          onPress={yesFunc}
        >
          <MaterialCommunityIcons
            name='check'
            size={30}
            color='#fff'
          />
        </TouchableOpacity>
        <TouchableOpacity style={[globalStyles.button, globalStyles.rejected]}
          onPress={noFunc}
        >

          <MaterialCommunityIcons
            name="window-close"
            size={30}
            color='#fff'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const EditButton = ({ setModalOpen, setEditData, editData, style }) => {
  return (
    <TouchableOpacity onPress={() => {setEditData(editData); setModalOpen(true);}}>
      <Ionicons
        name='ellipsis-horizontal-sharp'
        size={24} 
        color="black"
        style={style}
      />
    </TouchableOpacity>
  )
};
export const AddButton = ({ setModalOpen, style }) => {
  return (
    <TouchableOpacity onPress={() => setModalOpen(true)} style={[globalStyles.addIconButton, style]}>
      <MaterialCommunityIcons
        name='plus'
        size={50}
        style={globalStyles.modalToggle}
      />
    </TouchableOpacity>
  )
};

export const TimeLinAddBtn = ({ setModalOpen, style }) => {
  return (
    <TouchableOpacity onPress={() => setModalOpen(true)} style={[globalStyles.timelineAdd, style]}>
      <MaterialCommunityIcons
        name='plus'
        size={50}
        style={{ color:primary, textAlign:'center', textAlignVertical:'center'}}
      />
    </TouchableOpacity>
  )
};

export const AddButtonSqr = ({ setModalOpen, style }) => {
  return (
    <TouchableOpacity onPress={() => setModalOpen(true)} style={[globalStyles.buttonStyle, style]}>
      <MaterialCommunityIcons
        name='plus'
        size={30}
        style={[globalStyles.modalToggle, {margin:5}]}
      />
    </TouchableOpacity>
  )
};

export const StyledModal = ({ modalOpen, setModalOpen, AddComponent, ...props }) => {
  // console.log("Trig");
  return (
    <Modal visible={modalOpen} animationType="slide">
      <View style={[globalStyles.container, globalStyles.modalContent]}>
        <MaterialCommunityIcons
          name='window-close'
          size={24}
          style={{...globalStyles.modalToggle, ...globalStyles.modalClose}}
          onPress={() => setModalOpen(false)}
        />
        <AddComponent setModalOpen={setModalOpen} {...props}/>
      </View>
    </Modal>
  )
};

export const StyledDTPicker = ({ label, onPress, iconName, ...textInputProps }) => {
  // console.log(lable);
  return (
    <>
      <Text>{label}</Text>
      <TouchableOpacity onPress={onPress} style={globalStyles.textInput}>
        <MaterialCommunityIcons name={iconName} size={30}/>
        <TextInput 
          style={globalStyles.textInputText} 
          editable={false}
          {...textInputProps}
          // placeholder={placeholder}
          // value={textInput}
          // onChangeText={onChangeText}
        />
      </TouchableOpacity>
    </>
  )
};

export const BlueButton = ({ onPress, buttonText, style, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[globalStyles.buttonStyle, style]}>
      <Text style={[globalStyles.buttonText, textStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export const TempButton = ({ onPress, buttonText }) => {
  // yellow button for expenses

  return (
    <TouchableOpacity onPress={onPress} style={[globalStyles.buttonStyle, globalStyles.yellow, globalStyles.temp]}>
      <Text style={[globalStyles.buttonText,{color:'black'}]}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export const VoteStat = ({ name, status, text, onPress }) => {
  // yellow button for expenses
  // console.log(text);
  return (
    <TouchableOpacity style={[{flexDirection:'row', alignItems:'center'}]} onPress={onPress}>
      <Text style={[{color:StatusColor[status]}]}>{text}</Text>
      <View style={[globalStyles.status, globalStyles[status], {backgroundColor:0, marginLeft:2}]}> 
        <MaterialCommunityIcons name={name} size={15} color={StatusColor[status]} />
      </View>
    </TouchableOpacity>
  )
}