import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { checkStatus, sendStatus } from "../utils/fetchUtils";
import API_URL from "../config";

export const EventContext = createContext();

export function EventProvider({children}) {
  const { userData, authHeader } = useContext(AuthContext);
  
  const [tripEvents, setTripEvents] = useState(null);//trip events for one trip
  const [tripid, setTripid] = useState(null);//trip id
  const [ modalOpen, setModalOpen] = useState(false);


  const getTripEvents = async (tripid) => {
    // console.log("🍎",tripid);
    setTripid(tripid);// maybe in trips screen page??
    
    const tripEvents = await fetch(`http://${API_URL}:8080/timeline/${tripid}`,{
      method:"GET",
      headers: authHeader
    })
    // console.log("🍎",tripEvents);

    // console.log("🍎",tripEvents.url);

    if(tripEvents.status === 404){ //need to reset for calendar
      return setTripEvents(null);
    }

    checkStatus(tripEvents, setTripEvents);

    
    // return tripEventsRes
    
  };

  const postTripEvents = async (tripEventInput) => {
    tripEventInput.tripid = tripid
     
    const postTripEvents = await fetch(`http://${API_URL}:8080/timeline/create`, {
      method:"POST",
      headers: authHeader,
      body:JSON.stringify(tripEventInput)
    })

    sendStatus(postTripEvents, getTripEvents, tripid)
    
  };

  const editTripEvents = async (tripEventInput) => {
    tripEventInput.tripid = tripid
    const eventid = tripEventInput.event_id
    console.log("edit this info", tripEventInput)
     
    const editTripEvents = await fetch(`http://${API_URL}:8080/timeline/update/${eventid}`, {
      method:"PUT",
      headers: authHeader,
      body:JSON.stringify(tripEventInput)
    })

    sendStatus(editTripEvents, getTripEvents, tripid)

  }

  const deleteTripEvents = async (tripEventInput) => {
    tripEventInput.tripid = tripid
    const eventid = tripEventInput.event_id
     
    const deleteTripEvents = await fetch(`http://${API_URL}:8080/timeline/delete/${eventid}`, {
      method:"DELETE",
      headers: authHeader,
      body:JSON.stringify(tripEventInput)
    })

    sendStatus(deleteTripEvents, getTripEvents, tripid);

  }
  

  return (
    <EventContext.Provider value={{ tripEvents, tripid, getTripEvents, postTripEvents, editTripEvents, deleteTripEvents, modalOpen, setModalOpen}}>
      {children}
    </EventContext.Provider>
  )
}