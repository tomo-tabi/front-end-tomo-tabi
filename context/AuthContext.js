import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import API_URL from "../config";

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const postOptions = (input) => {
    return {
      method:"POST",
      headers: {
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(input)
    }
  };

  const setData = async (userInfo) => {
    if (userInfo) {
      setIsLoading(true);
      AsyncStorage.setItem('userToken', userInfo.token);
      setUserData(userInfo);
      setUserToken(userInfo.token);
      setIsLoading(false);
    }
  }

  const checkStatus = (res, req, setFunc) => {
    if (req.status === 200 || req.status === 201) {
      setFunc(res)
    } else {
      Alert.alert(res.message)
    }
  }

  const signup = async (userInput) => {
    console.log("authContext",userInput);
    try {
      const signupReq = await fetch(`http://${API_URL}:8080/user/signup`,
        postOptions(userInput)
      )
      
      const signupRes = await signupReq.json();
      checkStatus(signupRes, signupReq, setData)
      // setData(signupRes);

    } catch (error) {
      console.error(error)
    }
  }

  const login = async (userInput) => {
    try {
      const loginReq = await fetch(`http://${API_URL}:8080/user/login`,
        postOptions(userInput)
      )

      const loginRes = await loginReq.json();
      checkStatus(loginRes, loginReq, setData)

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

 // only when user logged before and quite app
  const isLoggedIn = async () => {
    try{
      setIsLoading(true)
      let userTokenStored = await AsyncStorage.getItem('userToken');

      if (userTokenStored === null) {
        setIsLoading(false);
        return
      } else {
        setUserToken(userTokenStored);
        
        const isLoggedInReq = await fetch(`http://${API_URL}:8080/user/`, {
          method:"GET",
          headers: {
            'Accept': 'application/json, text/plain, */*', 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenStored}`
          }
        });
        
        const isLoggedInRes = await isLoggedInReq.json();
        checkStatus(isLoggedInRes, isLoggedInReq, setUserData)
        // console.log(isLoggedInRes);
        // setUserData(isLoggedInRes);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(`Login Error: ${e}`)
    }
  }

  useEffect(() => {
    isLoggedIn();
    // if(userToken){
    // }
  }, []);
  
  return (
    <AuthContext.Provider value={{login, logout, signup, userToken, userData, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
};
