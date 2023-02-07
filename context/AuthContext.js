import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import API_URL from '../config';
import { userPostOpt, checkStatus } from '../utils/fetchUtils';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const setData = async userInfo => {
    // console.log("object");
    if (userInfo) {
      setIsLoading(true);
      await AsyncStorage.setItem('userToken', userInfo.token);
      setUserData(userInfo);
      setUserToken(userInfo.token);
      setIsLoading(false);
    }
  };

  const setDataPassword = async userInfo => {
    await AsyncStorage.setItem('userToken', userInfo.token);
    setUserData(userInfo);
    setUserToken(userInfo.token);
  }

  const authHeader = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`,
  };

  const signup = async userInput => {
    try {
      const signup = await fetch(
        `${API_URL}/user/signup`,
        userPostOpt(userInput)
      );

      checkStatus(signup, setData);

      // const signupRes = await signupReq.json();
      // userCheckStatus(signupRes, signupReq, setData)
      // setData(signupRes);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async userInput => {
    try {
      const login = await fetch(
        `${API_URL}/user/login`,
        userPostOpt(userInput)
      );

      //can't see email not found becasue it's a 404
      checkStatus(login, setData);

      // const loginRes = await loginReq.json();
      // userCheckStatus(loginRes, loginReq, setData)
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setIsLoading(true);
    setUserData(null);
    AsyncStorage.removeItem('userToken');
    setUserToken(null);
    setIsLoading(false);
  };

  // only when user logged before and quite app
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userTokenStored = await AsyncStorage.getItem('userToken');

      if (userTokenStored === null) {
        setIsLoading(false);
        return;
      } else {
        setUserToken(userTokenStored);

        const isLoggedIn = await fetch(`${API_URL}/user/`, {
          method: 'GET',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userTokenStored}`,
          },
        });

        if (isLoggedIn.status === 401) {
          await AsyncStorage.removeItem('userToken');
          setUserData(null);
          setIsLoading(false);
          return;
        }

        checkStatus(isLoggedIn, setUserData);
        // console.log("???", isLoggedInReq);
        // const isLoggedInRes = await isLoggedInReq.json();
        // userCheckStatus(isLoggedInRes, isLoggedInReq, setUserData)
        setIsLoading(false);
      }
    } catch (e) {
      console.log(`Logged in Error: ${e}`);
    }
  };

  const editUser = async userInfo => {
    try {
      const editUserInfo = await fetch(`${API_URL}/user/update`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(userInfo),
      });


      checkStatus(editUserInfo, setUserData);
    } catch (e) {
      console.log(`Update Info Error: ${e}`);
    }
  };

  const editPassword = async PasswordInfo => {
    try {
      const editPassword = await fetch(`${API_URL}/user/password`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(PasswordInfo),
      });

      checkStatus(editPassword, setDataPassword);
    } catch (e) {
      console.log(`Update Password Error: ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
    // if(userToken){
    // }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        signup,
        editUser,
        editPassword,
        authHeader,
        userToken,
        userData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
