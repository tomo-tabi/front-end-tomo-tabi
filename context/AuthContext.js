import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  

  const login = (userInput) => {
    //use axios or fetch to check user data base?
    
    // case1: email doesn't exists/ is wrong

    // case2: password is wrong 

    // case3: user exists 
    const userData = {
      email: "123@123.com",
      password: "123",
      userId: 1
    };
    const userInData = true;

    if(userInData){
      setIsLoading(true);
      AsyncStorage.setItem('userToken', "sdkfjalsd");
      setUserData(userData);
      setIsLoading(false);
    }
  }
  const logout = () => {
    setIsLoading(true);
    setUserData(null);
    AsyncStorage.removeItem('userToken')
    setUserToken(null);
    setIsLoading(false);
  }

  const isLoggedIn = async () => {
    try{

      setIsLoading(true)
      let userToken = await AsyncStorage.getItem('userToken')
      // console.log("🍇",userToken);
      setUserToken(userToken)
      setIsLoading(false)
    } catch (e) {
      console.log(`Login Error: ${e}`)
    }
  }

  useEffect(() => {
    isLoggedIn()
  }, [userData])
  

//   const pressHandler = (userInputObj) => {
//     //fetch user info from database
//     if(userData.email === userInputObj.email && userData.password === userInputObj.password){
//       console.log(userInputObj.email)
//       navigation.navigate('Trips')
//     } else {
//       Alert.alert(
//         "Wron Password",
//         "please write correct Password",
//         [
//           { text: "OK", onPress: () => console.log("OK Pressed") }
//         ]
//       );
//     }
// }
  return (
    <AuthContext.Provider value={{login, logout, userToken, userData, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
};
