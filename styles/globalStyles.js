import styled from 'styled-components';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Modal } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const colors = {
  primary:"#ffffff",
  pink:"#F187A4",
  blue:"#9CCAEC",
  yellow:"#FECE76",
  lightBlue:"#E5EFF9",
  navy:"#1F2937",
  grey:"#E5E7EB"
}

const { primary, pink, blue, yellow, lightBlue, navy, grey } = colors

// import { globalStyles, StyledButton, SubmitText, MyTextInput } from "../styles/globalStyles";
//globalStyles.addIconButton
export const globalStyles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: primary,//used to be '#fff'
    paddingHorizontal: 10,
    paddingTop:10,
  },
  expenseContainer:{
    flex: 1,
    padding: 16,
    paddingTop: 2,
  },

  addIconButton:{//iconContainer
    alignItems:"center",
    alignSelf:"flex-end",
    backgroundColor:'#F187A4',
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
    marginLeft:14,
    fontSize:16,
  },
  modalContent:{
    flex:1,
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
});

// mostly formik
export const LeftIcon = styled(View)`
  left: 10px;
  top: 35px;
  position: absolute;
  z-index: 1;
`;

export const StyledInputLabel = styled(Text)`
  color: ${ navy };
  font-size: 13px;
  text-align: left;
`;

export const StyledButton = styled(TouchableOpacity)`
  background-color: ${ blue };
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
`;
export const StyledTextInput = ({ ...props} ) => {
  return (
    <TextInput style={globalStyles.textInputText} {...props}/>
  )
}

export function SubmitText() {
  return (
    <Text style={globalStyles.buttonText}>
        Submit
     </Text>
  )
}



export const MyTextInput = ( { label, icon, ...props }) => {
  return (
      <View>
        <StyledInputLabel>{label}</StyledInputLabel>
        <View style={globalStyles.textInput}>
          <MaterialCommunityIcons name={icon} size={30} />
          <StyledTextInput {...props}/>
        </View>
      </View>
  );
};

export const AddButton = () => {
  return (
    <MaterialCommunityIcons
      name='plus'
      size={50}
      style={globalStyles.modalToggle}
    />
  )
}

export const StyledModal = (modalOpen, setModalOpen, AddComponent) => {
  return (
    <Modal visible={modalOpen} animationType="slide">
      <View style={globalStyles.modalContent}>
        <MaterialCommunityIcons
          name='window-close'
          size={24}
          style={{...globalStyles.modalToggle, ...globalStyles.modalClose}}
          onPress={() => setModalOpen(false)}
        />
        <AddComponent setModalOpen={setModalOpen}/>
      </View>
    </Modal>
  )
}