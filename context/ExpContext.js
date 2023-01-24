import React, { createContext, useContext, useState } from "react";
import API_URL from "../config";

import { AuthContext } from "./AuthContext";
import { EventContext } from "./EventContext";
import { checkStatus, sendStatus } from "../utils/fetchUtils";

export const ExpContext = createContext();

export function ExpProvider({ children }) {
  const { tripid } = useContext(EventContext);
  const { authHeader } = useContext(AuthContext);

  const [ expData, setExpData ] = useState(null);

  const getExp = async () => {
    const getExpReq = await fetch(`http://${API_URL}:8080/expense/${tripid}`, {
      method:"GET",
      headers: authHeader
    })

    if(getExpReq.status === 204) {
      return
    }
    
    const getExpRes = await getExpReq.json();

    checkStatus(getExpRes, getExpReq, setExpData);
    
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

    const postExp = await fetch(`http://${API_URL}:8080/expense/create`, {
      method:"POST",
      headers: authHeader,
      body:JSON.stringify(expInput)
    })

    sendStatus(postExp, getExp);
    
  }

  const editExpense = async (expInput) => {
    expInput.tripid = tripid;
    const expenseid = expInput.id 

    const editExpense = await fetch(`http://${API_URL}:8080/expense/update/${expenseid}`, {
      method:"PUT",
      headers: authHeader,
      body:JSON.stringify(expInput)
    })

    sendStatus(editExpense, getExp);
    
  }

  const deleteExpense = async (expInput) => {
    expInput.tripid = tripid;
    const expenseid = expInput.id 

    const deleteExpense = await fetch(`http://${API_URL}:8080/expense/delete/${expenseid}`, {
      method:"DELETE",
      headers: authHeader,
      body:JSON.stringify(expInput)
    })

    sendStatus(deleteExpense, getExp);
    
  }

  return (
    <ExpContext.Provider value={{ getExp, postExp, editExpense, deleteExpense, expData }}>
      {children}
    </ExpContext.Provider>
  )
};

