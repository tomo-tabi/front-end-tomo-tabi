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
  greyBlue:"#6692B3"
}

const { primary, pink, blue, yellow, lightBlue, navy, grey, greyBlue } = colors

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
    backgroundColor: pink,
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
  yellow:{// yellow button for invite
    backgroundColor:'none',
    flex:1,
    marginVertical:0,
    // borderWidth:1,
    // borderColor:'black',
    // justifyContent:"flex-end",
    borderRadius:0,
    padding:5,
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
  line:{
    height:0.7,
    backgroundColor:greyBlue,
    marginVertical:10,
  },
});

export const Line = ({ style }) => {
  // console.log(style);
  return (
    <View style={[globalStyles.line, style]}></View>
  )
}

const darkLight = "#9CA3AF";

export const MyTextInput = ( { label, icon, ...props }) => {
  const touchRef = useRef();
  return (
      <View>
        <Text>{label}</Text>
        <TouchableOpacity 
          onPress={() => {touchRef.current.focus()}}
          style={globalStyles.textInput}
        >
          <MaterialCommunityIcons name={icon} size={30}/>
          <TextInput ref={touchRef} style={globalStyles.textInputText} 
            placeholderTextColor={darkLight}
            {...props}
          />
        </TouchableOpacity>
      </View>
  );
};

export const PasswordTextInput = ( { hidePassword, setHidePassword, ...props }) => {
  const touchRef = useRef();
  return (
      <View>
        <Text>Password</Text>
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
export const AddButton = ({ setModalOpen }) => {
  return (
    <TouchableOpacity onPress={() => setModalOpen(true)} style={globalStyles.addIconButton}>
      <MaterialCommunityIcons
        name='plus'
        size={50}
        style={globalStyles.modalToggle}
      />
    </TouchableOpacity>
  )
};

export const EditModal = ({ modalEditOpen, setModalEditOpen, EditComponent, EditData }) => {
  // console.log("Trig");
  return (
    <Modal visible={modalEditOpen} animationType="slide">
      <View style={[globalStyles.container, globalStyles.modalContent]}>
        <MaterialCommunityIcons
          name='window-close'
          size={24}
          style={{...globalStyles.modalToggle, ...globalStyles.modalClose}}
          onPress={() => setModalEditOpen(false)}
        />
        <EditComponent EditData={EditData} setModalEditOpen={setModalEditOpen}/>
      </View>
    </Modal>
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

export const BlueButton = ({ onPress, buttonText }) => {
  return (
    <TouchableOpacity onPress={onPress} style={globalStyles.buttonStyle}>
      <Text style={globalStyles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export const YellowButton = ({ onPress, iconName, buttonText }) => {
  // yellow button for invite

  return (
    <TouchableOpacity onPress={onPress} style={[globalStyles.buttonStyle, globalStyles.yellow]}>
      <MaterialCommunityIcons name={iconName} size={30}/>
      {buttonText ? 
      <Text style={globalStyles.buttonText}>{buttonText}</Text>
      :""}
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