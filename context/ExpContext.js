import React, { createContext, useContext, useState } from 'react';
import API_URL from '../config';

import { AuthContext } from './AuthContext';
import { EventContext } from './EventContext';
import { checkStatus, sendStatus } from '../utils/fetchUtils';

export const ExpContext = createContext();

export function ExpProvider({ children }) {
  const { tripid } = useContext(EventContext);
  const { authHeader } = useContext(AuthContext);

  const [expData, setExpData] = useState(null);

  const getExp = async () => {
    const getExp = await fetch(`${API_URL}/expense/${tripid}`, {
      method: 'GET',
      headers: authHeader,
    });

    if (getExp.status === 404) {
      return setExpData(null)
    }

    checkStatus(getExp, setExpData);

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
  };

  const postExp = async expInput => {
    expInput.tripid = tripid;

    const postExp = await fetch(`${API_URL}/expense/create`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(expInput),
    });

    sendStatus(postExp, getExp);
  };

  const editExpense = async expInput => {
    expInput.tripid = tripid;
    const expenseid = expInput.id;

    const editExpense = await fetch(`${API_URL}/expense/update/${expenseid}`, {
      method: 'PUT',
      headers: authHeader,
      body: JSON.stringify(expInput),
    });

    sendStatus(editExpense, getExp);
  };

  const deleteExpense = async expInput => {
    expInput.tripid = tripid;
    const expenseid = expInput.id;

    const deleteExpense = await fetch(
      `${API_URL}/expense/delete/${expenseid}`,
      {
        method: 'DELETE',
        headers: authHeader,
        body: JSON.stringify(expInput),
      }
    );

    sendStatus(deleteExpense, getExp);
  };

  return (
    <ExpContext.Provider
      value={{ getExp, postExp, editExpense, deleteExpense, expData }}
    >
      {children}
    </ExpContext.Provider>
  );
}
