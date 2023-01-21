import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { AuthContext } from "./AuthContext";
import { TripContext } from "./TripContext"
import { EventContext } from "./EventContext";
import { checkStatus } from "../utils/fetchUtils";
import API_URL from "../config";

export const InviteContext = createContext();

export function InviteProvider({children}) {
  const { userData, authHeader } = useContext(AuthContext);
  const { getTrips } = useContext(TripContext);
  const { tripid } = useContext(EventContext);
  
  const [invites, setInvites] = useState(null);//all pending invites for user
  // console.log(tripid);
 
  const getInvites = async () => {
    try{

      const getInvites = await fetch(`http://${API_URL}:8080/invite/`,{
        method:"GET",
        headers: authHeader
      })

      const res = await getInvites.json();
      checkStatus(res,getInvites,setInvites)

    } catch (e) {
      console.log(`Invite Error: ${e}`);
    } 
  }



  const acceptInvites = async (inviteID) => {
    try{
      const acceptInvites = await fetch(`http://${API_URL}:8080/invite/accept/${inviteID}`,{
        method:"PUT",
        headers: authHeader
      })

      const res = await acceptInvites.json();

      checkStatus(res, acceptInvites, (res) => {
        getInvites();
        getTrips()
        return console.log(res);
      })
    } catch (e) {
        console.log(`Accept Invite Error: ${e}`);
    } 
  }
  const rejectInvites = async (inviteID) => {
    try{
      const rejectInvites = await fetch(`http://${API_URL}:8080/invite/reject/${inviteID}`,{
        method:"PUT",
        headers: authHeader
      })
      
      const res = await rejectInvites.json();

      checkStatus(res, rejectInvites, (res) => {
        getInvites();
        getTrips()
        return console.log(res);
      })
    } catch (e) {
      console.log(`Reject Invite Error: ${e}`);
    } 
  }

  
  const postInvite = async (userEmail) => {
    // console.log("tripid Invite",tripid);
    userEmail.tripid = tripid

    const postInviteReq = await fetch(`http://${API_URL}:8080/invite/create`, {
        method:"POST",
        headers: authHeader,
        body:JSON.stringify(userEmail)
    });

    const postInviteRes = await postInviteReq.json();

    checkStatus(postInviteRes, postInviteReq, (res) => {
      return Alert.alert(res.message)
    })
  }

  useEffect(() => {
    if(userData){
      getInvites();
    }
  }, [userData])
  

  return (
    <InviteContext.Provider value={{ invites, rejectInvites, acceptInvites, getInvites, postInvite}}>
      {children}
    </InviteContext.Provider>
  )
}