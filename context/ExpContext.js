import React, { createContext, useContext, useState } from "react";
import {API_URL} from "../config";

import { AuthContext } from "./AuthContext";
import { InfoContext } from "./InfoContext";

export const ExpContext = createContext();

export function ExpProvider({ children }) {
  const { tripid } = useContext(InfoContext);
  const { userToken } = useContext(AuthContext);

  const [ expData, setExpData ] = useState(null);

  const authHeader = {
    'Accept': 'application/json, text/plain, */*', 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  }

  // should I import this from Auth context?
  const checkStatus = (res, req, setFunc) => {
    // console.log(setFunc);
    if (req.status === 404) {
      return
    }

    if (req.status === 200) {
      setFunc(res);
    } else {
      Alert.alert(res.message);
    }
  };


  const getExp = async () => {
    const getExpReq = await fetch(`http://${API_URL}:8080/expense/${tripid}`, {
      method:"GET",
      headers: authHeader
    })

    if(getExpReq.status === 204) {
      return
    }
    // console.log("H",getExpReq.status);
    
    const getExpRes = await getExpReq.json();
    // console.log("H",getExpRes);

    checkStatus(getExpRes, getExpReq, setExpData)
    
    // setExpData(getExpRes);
    
    //returns:
    // [
    //   {
    //     "id": 8,
    //     "user_id": 3,
    //     "item_name": "hotel",
    //     "money": "9543.26",
    //     "trip_id": 4
    //   },
    //   {
    //     "id": 9,
    //     "user_id": 4,
    //     "item_name": "restaurant",
    //     "money": "12656.86",
    //     "trip_id": 4
    //   }
    // ]

  }
  const postExp = async (expInput) => {
    expInput.tripid = tripid;

    const postExpReq = await fetch(`http://${API_URL}:8080/expense/create`, {
      method:"POST",
      headers: authHeader,
      body:JSON.stringify(expInput)
    })
    
    const postExpRes = await postExpReq.json();
    checkStatus(postExpRes, postExpReq, (res) => {
      getExp();
      return console.log(res);
    })

  }

  return (
    <ExpContext.Provider value={{ getExp, postExp, expData }}>
      {children}
    </ExpContext.Provider>
  )
};

