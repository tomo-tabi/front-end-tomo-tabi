import styled from 'styled-components';
import { StyleSheet, TouchableOpacity, Text, View, TextInput, Modal } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from "../config"


export const colors = {
  primary: "#ffffff",
  pink: "#F187A4",
  blue: "#9CCAEC",
  yellow: "#FECE76",
  lightBlue: "#E5EFF9",
  navy: "#1F2937",
  grey: "#E5E7EB"
}

const { primary, pink, blue, yellow, lightBlue, navy, grey } = colors

// import { globalStyles, SubmitText, MyTextInput } from "../styles/globalStyles";
//globalStyles.addIconButton
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightBlue,//used to be '#fff'
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  // expenseContainer:{
  //   flex: 1,
  //   padding: 16,
  //   paddingTop: 2,
  // },

  addIconButton: {//iconContainer
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: pink,
    borderRadius: 40,
    justiftyContent: "center",
    margin: 5,
    marginRight: 15,

    height: 70,
    width: 70,

    position: "absolute",
    right: 0,
    bottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 7,
  },
  buttonStyle: {
    backgroundColor: blue,
    // justiftyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 3,
    padding: 18,
    paddingHorizontal: 10,
    // flex:1,
  },
  yellow: {
    backgroundColor: 'none',
    flex: 1,
    marginVertical: 0,
    // borderWidth:1,
    // borderColor:'black',
    // justifyContent:"flex-end",
    borderRadius: 0,
    padding: 5,
  },
  temp: {
    backgroundColor: yellow,
    borderRadius: 6,
    alignContent: "space-around",
    paddingVertical: 10,
    // paddingTop:1,

    marginHorizontal: 5,
    marginVertical: 10,

    // textAlign:'center',
    // borderWidth:1,
    // borderColor:'black',

  },
  buttonText: {
    fontSize: 16,
    color: primary
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 60,
    marginVertical: 3,
    marginBottom: 10,
    backgroundColor: grey,
    fontSize: 16,
  },
  textInputGooglePlaces: {
    overflow :"visible",
    elevation:900,
    zIndex:900,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 3,
    marginBottom: 10,
    backgroundColor: grey,
    fontSize: 16,
  },
  textInputText: {
    color: navy,//input text color?
    marginLeft: 14,
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    backgroundColor: primary,
    // margin:5,
  },
  modalToggle: {
    margin: 10,
    alignSelf: "flex-end",
    color: '#fff',
  },
  modalClose: {
    margin: 5,
    color: 'black'
  },
});

// mostly formik
export const LeftIcon = styled(View)`
  left: 10px;
  top: 35px;
  position: absolute;
  z-index: 1;
`;

export const TestingGoogleSearch = ({ label, icon, ...props }) => {
  return (
    <View>
      <Text>{label}</Text>
      <View style={globalStyles.textInputGooglePlaces}>
        <MaterialCommunityIcons name={icon} size={30} />
        <GooglePlacesAutocomplete
          placeholder='Search'
          onPress={(data, details) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          isRowScrollable={true}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
        />
      </View>
    </View>
  );
}

export const MyTextInput = ({ label, icon, ...props }) => {
  return (
    <View>
      <Text>{label}</Text>
      <View style={globalStyles.textInput}>
        <MaterialCommunityIcons name={icon} size={30} />
        <TextInput style={globalStyles.textInputText} {...props} />
      </View>
    </View>
  );
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

export const StyledModal = ({ modalOpen, setModalOpen, AddComponent }) => {
  // console.log("Trig");
  return (
    <Modal visible={modalOpen} animationType="slide">
      <View style={[globalStyles.container, globalStyles.modalContent]}>
        <MaterialCommunityIcons
          name='window-close'
          size={24}
          style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
          onPress={() => setModalOpen(false)}
        />
        <AddComponent setModalOpen={setModalOpen} />
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
        <MaterialCommunityIcons name={iconName} size={30} />
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

  return (
    <TouchableOpacity onPress={onPress} style={[globalStyles.buttonStyle, globalStyles.yellow]}>
      <MaterialCommunityIcons name={iconName} size={30} />
      {buttonText ?
        <Text style={globalStyles.buttonText}>{buttonText}</Text>
        : ""}
    </TouchableOpacity>
  )
}

export const TempButton = ({ onPress, buttonText }) => {

  return (
    <TouchableOpacity onPress={onPress} style={[globalStyles.buttonStyle, globalStyles.yellow, globalStyles.temp]}>
      <Text style={[globalStyles.buttonText, { color: 'black' }]}>{buttonText}</Text>
    </TouchableOpacity>
  )
}