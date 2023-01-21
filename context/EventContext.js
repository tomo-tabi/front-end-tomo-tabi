import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { AuthContext } from "./AuthContext";
import API_URL from "../config";

export const EventContext = createContext();

export function EventProvider({children}) {
  const [tripEvents, setTripEvents] = useState(null);//trip events for one trip
  const [tripid, setTripid] = useState(null);//trip id

  const { userData, userToken } = useContext(AuthContext);

  const authHeader = {
    'Accept': 'application/json, text/plain, */*', 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  };

  // should I import this from Auth context?
  const checkStatus = (res, req, setFunc) => {
    // console.log(req.status);
    if (req.status === 404) {
      return
    }
    if (req.status === 200) {
      setFunc(res);
    } else {
      Alert.alert(res.message);
    }
  };
  
  const getTripEvents = async (tripid) => {
    // console.log("🍎",tripid);
    setTripid(tripid);// maybe in trips screen page??
    
    const tripEventsReq = await fetch(`http://${API_URL}:8080/timeline/${tripid}`,{
      method:"GET",
      headers: authHeader
    })
    // console.log("🍎",tripEventsReq);
    if(tripEventsReq.status === 204) {
      return
    }
    const tripEventsRes = await tripEventsReq.json();
    // console.log("🍎",tripEventsReq.status);

    checkStatus(tripEventsRes, tripEventsReq, setTripEvents);

    if(tripEventsReq.status === 404){
      setTripEvents(null)
    }
    // return tripEventsRes
    
  };

  const postTripEvents = async (tripEventInput) => {
    tripEventInput.tripid = tripid
     
    const postTripEventsReq = await fetch(`http://${API_URL}:8080/timeline/create`, {
      method:"POST",
      headers: authHeader,
      body:JSON.stringify(tripEventInput)
    })

    const postTripEventsRes = await postTripEventsReq.json();

    checkStatus(postTripEventsRes, postTripEventsReq, (res) => {
      getTripEvents(tripid);
      return console.log(res);
    })
    
  };
  

  return (
    <EventContext.Provider value={{ tripEvents, tripid, getTripEvents, postTripEvents}}>
      {children}
    </EventContext.Provider>
  )
}