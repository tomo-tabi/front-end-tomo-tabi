import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API_URL from "../config";

export const InfoContext = createContext();

export function InfoProvider({children}) {
  const [trips, setTrips] = useState(null);
  const [tripDb, setTripDb] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);

  const { userData, userToken } = useContext(AuthContext)
  // console.log("🍏",userData)
  // to fetch trip data we only need current user token 

  const test = async () => {
    const jwt = await fetch(`http://${API_URL}:8080/user/`,{
      method:"GET",
      headers: {
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ userToken
      }
    })
    const res = await jwt.json()
    console.log("🍏",res);
    return res
  }

  const tripData = { //using userData.id
    2:[
      {tripName: 'Tokyo', id:1},
      {tripName: 'Osaka', id:2},
      {tripName: 'Boston', id:3},
    ]
  }

  const dataBase = {
    1: [
      {eventDate: '2022-12-04', eventName: 'Sky Tree', id:1},
      {eventDate: '2022-12-05', eventName: 'Tokyo Tower', id:2},
      {eventDate: '2022-12-06', eventName: 'Kura Sushi', id:3}
    ],
    2:[
      {eventDate: '2022-12-04', eventName: 'Universal Studios Japan', id:1},
      {eventDate: '2022-12-05', eventName: 'Osaka Castle (Osakajo)', id:2},
      {eventDate: '2022-12-06', eventName: 'Osaka Okonomiyaki', id:3}
    ],
    3:[
      {eventDate: '2022-12-04', eventName: 'Museum of Fine Arts', id:1},
      {eventDate: '2022-12-05', eventName: 'Fenway Parks', id:2},
      {eventDate: '2022-12-06', eventName: 'Freedom Trail', id:3}
    ]
  }

  useEffect(() => {
    test();

    if(userData){
      setTrips(tripData[2])
      setTripDb(dataBase)
    }
  }, [])
  

  return (
    <InfoContext.Provider value={{trips, tripDetails, tripDb, setTripDetails}}>
      {children}
    </InfoContext.Provider>
  )
}