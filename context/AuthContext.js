import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { API_URL } from "../config";


export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchOptions = (input) => {
    return {
      method:"POST",
      //need headers?
      headers: {
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(input)
    }
  };

  const setData = (userInfo) => {
    if (userInfo) {
      setIsLoading(true);
      AsyncStorage.setItem('userToken', userInfo.token);
      setUserData(userInfo);
      setIsLoading(false);
    }
  }

  const signup = async (userInput) => {
    try {
      //don't use localhost use wifi if address
      const signupReq = await fetch(`http://${API_URL}:8080/user/signup`,
        fetchOptions(userInput)
      )
      const signupRes = await signupReq.json();

      // console.log("🍌",signupRes.token);

      setData(signupRes);

    } catch (error) {
      console.error(error)
    }
  }

  const login = async (userInput) => {
    try {
      // use axios?
      const loginReq = await fetch(`http://${API_URL}:8080/user/login`,
        fetchOptions(userInput)
      )
      const loginRes = await loginReq.json();
      setData(loginRes);
    } catch (error) {
      console.error(error)
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
      console.log("🍇",userToken);
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
    <AuthContext.Provider value={{login, logout, signup, userToken, userData, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
};
