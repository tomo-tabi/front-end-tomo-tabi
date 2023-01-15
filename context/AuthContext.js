import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import API_URL from "../config";


export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState();
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
      setUserToken(userInfo.token)
      console.log(userData)
      setIsLoading(false);
    }
  }

  const signup = async (userInput) => {
    try {

      const signupReq = await fetch(`http://${API_URL}:8080/user/signup`,
        fetchOptions(userInput)
      )
      const signupRes = await signupReq.json();

      // console.log("🍌",signupRes.token);

      setData(signupRes);
      // setUserToken(signupRes.token);//New line

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
      // setUserToken(loginRes.token);//New line
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
      // if (!userToken) {//new line
      //   setIsLoading(false)// new line
      // }else // new line
      setIsLoading(true)
      let userTokenStored = await AsyncStorage.getItem('userToken');
      console.log("🍇",userTokenStored);
      setUserToken(userTokenStored);

      const isLoggedInReq = await fetch(`http://${API_URL}:8080/user/`, {
        method:"GET",
        headers: {
          'Accept': 'application/json, text/plain, */*', 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userTokenStored}`
        }
      });

      let isLoggedInRes = await isLoggedInReq.json();
      setUserData(isLoggedInRes);
      console.log(userData);
      setIsLoading(false);
    } catch (e) {
      console.log(`Login Error: ${e}`)
    }
  }

  useEffect(() => {
    if (userToken) {
      isLoggedIn();
    }
    
  }, [])
  
  return (
    <AuthContext.Provider value={{login, logout, signup, userToken, userData, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
};
