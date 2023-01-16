import React, { createContext, useContext, useState, useContext } from "react";
import API_URL from "../config";

import { AuthContext } from "./AuthContext";
import { InfoContext } from "./InfoContext";

export const ExpContext = createContext();

export function ExpProvider({ children }) {
  const { tripid } = useContext(InfoContext);
  const { userToken } = useContext(AuthContext);

  const [ expData, setExpData ] = useState(null);


  const getExp = async () => {
    const getExpReq = await fetch(`http://${API_URL}:8080/expense/${tripid}`, {
      method:"GET",
      headers:{
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    })
    const getExpRes = await getExpReq.json();
    
    setExpData(getExpRes);
    
    //returns:
    [
      {
        "id": 8,
        "user_id": 3,
        "item_name": "hotel",
        "money": "9543.26",
        "trip_id": 4
      },
      {
        "id": 9,
        "user_id": 4,
        "item_name": "restaurant",
        "money": "12656.86",
        "trip_id": 4
      }
    ]

  }
  const postExp = async (expInput) => {
    expInput.tripid = tripid;

    const postExpReq = await fetch(`http://${API_URL}:8080/expense/create${tripid}`, {
      method:"GET",
      headers:{
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    })
    
    const postExpRes = await postExpReq.json();

  }

  return (
    <ExpContext.Provider value={{ getExp, postExp, expData }}>
      {children}
    </ExpContext.Provider>
  )
};

