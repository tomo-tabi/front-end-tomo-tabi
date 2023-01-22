import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { checkStatus } from "../utils/fetchUtils";
import API_URL from "../config";

export const EventContext = createContext();

export function EventProvider({children}) {
  const { userData, authHeader } = useContext(AuthContext);
  
  const [tripEvents, setTripEvents] = useState(null);//trip events for one trip
  const [tripid, setTripid] = useState(null);//trip id


  const getTripEvents = async (tripid) => {
    // console.log("🍎",tripid);
    setTripid(tripid);// maybe in trips screen page??
    
    const tripEventsReq = await fetch(`http://${API_URL}:8080/timeline/${tripid}`,{
      method:"GET",
      headers: authHeader
    })
    // console.log("🍎",tripEventsReq);

    const tripEventsRes = await tripEventsReq.json();
    // console.log("🍎",tripEventsReq.url);

    if(tripEventsReq.status === 404){ //need to reset for calendar
      return setTripEvents(null);
    }

    checkStatus(tripEventsRes, tripEventsReq, setTripEvents);

    
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

  const editTripEvents = async (tripEventInput) => {
    tripEventInput.tripid = tripid
    const eventid = tripEventInput.event_id
    console.log("edit this info", tripEventInput)

     
    const editTripEventsReq = await fetch(`http://${API_URL}:8080/timeline/update/${eventid}`, {
      method:"PUT",
      headers: authHeader,
      body:JSON.stringify(tripEventInput)
    })

    const editTripEventsRes = await editTripEventsReq.json();

    checkStatus(editTripEventsRes, editTripEventsReq, (res) => {
      getTripEvents(tripid);
      return console.log(res);
    })
  }

  const deleteTripEvents = async (tripEventInput) => {
    tripEventInput.tripid = tripid
    const eventid = tripEventInput.event_id
     
    const deleteTripEventsReq = await fetch(`http://${API_URL}:8080/timeline/delete/${eventid}`, {
      method:"DELETE",
      headers: authHeader,
      body:JSON.stringify(tripEventInput)
    })

    const deleteTripEventsRes = await deleteTripEventsReq.json();

    checkStatus(deleteTripEventsRes, deleteTripEventsReq, (res) => {
      getTripEvents(tripid);
      return console.log(res);
    })
  }
  

  return (
    <EventContext.Provider value={{ tripEvents, tripid, getTripEvents, postTripEvents, editTripEvents, deleteTripEvents}}>
      {children}
    </EventContext.Provider>
  )
}