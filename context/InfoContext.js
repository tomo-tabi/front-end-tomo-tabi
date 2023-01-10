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
        'Authorization': `Bearer ${userToken}`
      }
    })
    const res = await jwt.json()
    // console.log("🍏",res);
    return res
  }

  const tripData = { //using userData.id
    2:[
      {tripName: 'Tokyo', id:1, startDate: '2022-12-20', endDate: '2022-12-22', userid: 2},
      {tripName: 'Osaka', id:2, startDate: '2022-12-04', endDate: '2022-12-06', userid: 2},
      {tripName: 'Boston', id:3, startDate: '2023-01-04', endDate: '2023-01-06', userid: 2},
    ]
  }
  const sortTripByDate = (tripDataObjArr) => {
    //sort changes original array
    const sortedArr = tripDataObjArr.sort((a, b) => {
      if (a.startDate > b.startDate) {
        return -1;
      }
      if (a.startDate < b.startDate) {
        return 1;
      }
      return 0
    })
    return sortedArr
  }

  useEffect(() => {
    console.log(sortTripByDate(tripData[2]));
  },[])

  const timelineDB = {
    1:[
      {eventDate: '2022-12-20', eventName: 'Sky Tree', id:1},
      {eventDate: '2022-12-21', eventName: 'Tokyo Tower', id:2},
      {eventDate: '2022-12-22', eventName: 'Kura Sushi', id:3}
    ],
    2:[
      {eventDate: '2022-12-04', eventName: 'Universal Studios Japan', id:1},
      {eventDate: '2022-12-05', eventName: 'Osaka Castle (Osakajo)', id:2},
      {eventDate: '2022-12-06', eventName: 'Osaka Okonomiyaki', id:3}
    ],
    3:[
      {eventDate: '2023-01-04', eventName: 'Museum of Fine Arts', id:1},
      {eventDate: '2023-01-05', eventName: 'Fenway Parks', id:2},
      {eventDate: '2023-01-06', eventName: 'Freedom Trail', id:3}
    ]
  }

  useEffect(() => {
    test();

    if(userData){
      setTrips(tripData[2])
      setTripDb(timelineDB)
    }
  }, [])
  

  return (
    <InfoContext.Provider value={{trips, tripDetails, tripDb, setTripDetails}}>
      {children}
    </InfoContext.Provider>
  )
}