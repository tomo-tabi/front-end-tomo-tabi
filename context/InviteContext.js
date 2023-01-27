import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { AuthContext } from "./AuthContext";
import { TripContext } from "./TripContext"
import { EventContext } from "./EventContext";
import { checkStatus, sendStatus } from "../utils/fetchUtils";
import API_URL from "../config";

export const InviteContext = createContext();

export function InviteProvider({children}) {
  const { userData, authHeader } = useContext(AuthContext);
  const { getTrips, getUsersInTrip } = useContext(TripContext);
  const { tripid } = useContext(EventContext);
  
  const [invites, setInvites] = useState(null);//all pending invites for user
  const [invitesSent, setInvitesSent] = useState(null);
  // console.log(tripid);
 
  const getInvites = async () => {
    try{

      const getInvites = await fetch(`http://${API_URL}:8080/invite/`,{
        method:"GET",
        headers: authHeader
      })
      
      if(getInvites.status === 404) {
        setInvites(null);
        return
      }

      checkStatus(getInvites,setInvites)

    } catch (e) {
      console.log(`Invite Error: ${e}`);
    } 
  };

  const getInvitesSent = async () => {
    try{
      const getInvitesSent = await fetch(`http://${API_URL}:8080/invite/sent/${tripid}`, {
        method:"GET",
        headers: authHeader,
      });

      if(getInvitesSent.status === 404){ //need?
        return setInvitesSent(null);
      };

      checkStatus(getInvitesSent, setInvitesSent);

    } catch (e) {
      console.log(`Get Invite Sent Error: ${e}`);
    }
  }

  const acceptInvites = async (inviteID) => {
    try{
      const acceptInvites = await fetch(`http://${API_URL}:8080/invite/accept/${inviteID}`,{
        method:"PUT",
        headers: authHeader
      })

      sendStatus(acceptInvites,() => {
        getInvites();
        getTrips();
      })

    } catch (e) {
        console.log(`Accept Invite Error: ${e}`);
    } 
  };

  const rejectInvites = async (inviteID) => {
    try{
      const rejectInvites = await fetch(`http://${API_URL}:8080/invite/reject/${inviteID}`,{
        method:"PUT",
        headers: authHeader
      })

      sendStatus(rejectInvites,() => {
        getInvites();
        getTrips();
      })

    } catch (e) {
      console.log(`Reject Invite Error: ${e}`);
    } 
  };
  
  const postInvite = async (userEmail) => {
    try {
      // console.log("tripid Invite",tripid);
      userEmail.tripid = tripid;
      
      const postInviteReq = await fetch(`http://${API_URL}:8080/invite/create`, {
        method:"POST",
        headers: authHeader,
        body:JSON.stringify(userEmail)
      });
      
      sendStatus(postInviteReq, () => {
        return Alert.alert("Invite Created")
      });

    } catch (e) {
      console.log(`Post Invite Error: ${e}`);
    }
  };

  const deleteInviteSent = async (inviteid) => {
    const body = {
      tripid:tripid
    }
    try {
      const deleteInviteSent = await fetch(`http://${API_URL}:8080/invite/${inviteid}`, {
        method:"DELETE",
        headers: authHeader,
        body:JSON.stringify(body)
      });

      sendStatus(deleteInviteSent, () => {
        getInvitesSent();
      });

    } catch (e) {
      console.log(`Delete Invite Error: ${e}`);
    }
  };

  useEffect(() => {
    if(userData){
      getInvites();
    }
  }, [userData])
  

  return (
    <InviteContext.Provider value={{ invites, invitesSent, rejectInvites, acceptInvites, getInvites, getInvitesSent, postInvite, deleteInviteSent}}>
      {children}
    </InviteContext.Provider>
  )
}