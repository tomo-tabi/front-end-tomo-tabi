import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import API_URL from "../config";
import { userCheckStatus, userPostOpt } from "../utils/fetchUtils";

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const setData = async (userInfo) => {
    // console.log("object");
    if (userInfo) {
      setIsLoading(true);
      await AsyncStorage.setItem('userToken', userInfo.token);
      setUserData(userInfo);
      setUserToken(userInfo.token);
      setIsLoading(false);
    }
  }

  // I think this is working???
  const authHeader = {
    'Accept': 'application/json, text/plain, */*', 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  }

  const signup = async (userInput) => {
    try {
      const signupReq = await fetch(`http://${API_URL}:8080/user/signup`,
        userPostOpt(userInput)
      )
      
      const signupRes = await signupReq.json();
      userCheckStatus(signupRes, signupReq, setData)
      // setData(signupRes);

    } catch (error) {
      console.error(error)
    }
  }

  const login = async (userInput) => {
    try {
      const loginReq = await fetch(`http://${API_URL}:8080/user/login`,
        userPostOpt(userInput)
      )

      const loginRes = await loginReq.json();
      userCheckStatus(loginRes, loginReq, setData)

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
        
        
        // console.log("???", isLoggedInReq);
        const isLoggedInRes = await isLoggedInReq.json();
        userCheckStatus(isLoggedInRes, isLoggedInReq, setUserData)
        setIsLoading(false);
      }
    } catch (e) {
      console.log(`Logged in Error: ${e}`)
    }
  }

  useEffect(() => {
    isLoggedIn();
    // if(userToken){
    // }
  }, []);
  
  return (
    <AuthContext.Provider value={{login, logout, signup, authHeader, userToken, userData, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
};
