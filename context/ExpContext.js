import React, { createContext, useContext, useState } from "react";
import API_URL from "../config";

import { AuthContext } from "./AuthContext";
import { EventContext } from "./EventContext";
import { checkStatus } from "../utils/fetchUtils";

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

  const editExpense = async (expInput) => {
    expInput.tripid = tripid;
    const expenseid = expInput.id 

    const editExpense = await fetch(`http://${API_URL}:8080/expense/update/${expenseid}`, {
      method:"PUT",
      headers: authHeader,
      body:JSON.stringify(expInput)
    })
    
    const postExpRes = await editExpense.json();
    checkStatus(postExpRes, editExpense, (res) => {
      getExp();
      return console.log(res);
    })
  }

  const deleteExpense = async (expInput) => {
    expInput.tripid = tripid;
    const expenseid = expInput.id 

    const deleteExpense = await fetch(`http://${API_URL}:8080/expense/delete/${expenseid}`, {
      method:"DELETE",
      headers: authHeader,
      body:JSON.stringify(expInput)
    })
    
    const postExpRes = await deleteExpense.json();
    checkStatus(postExpRes, deleteExpense, (res) => {
      getExp();
      return console.log(res);
    })
  }

  return (
    <ExpContext.Provider value={{ getExp, postExp, editExpense, deleteExpense, expData }}>
      {children}
    </ExpContext.Provider>
  )
};

