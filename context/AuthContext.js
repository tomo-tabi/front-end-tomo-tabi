import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import API_URL from "../config";

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
      console.log(`http://${API_URL}:8080/user/login`);
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
      let userTokenStored = await AsyncStorage.getItem('userToken');
      // console.log("🍇",userTokenStored);
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
      // console.log(isLoggedInRes);
      setUserData(isLoggedInRes);
      setIsLoading(false);
    } catch (e) {
      console.log(`Login Error: ${e}`)
    }
  }

  useEffect(() => {
    isLoggedIn()
  }, [])
  
  return (
    <AuthContext.Provider value={{login, logout, signup, userToken, userData, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
};
