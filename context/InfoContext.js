import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { AuthContext } from "./AuthContext";
import API_URL from "../config";
import moment from 'moment';

export const InfoContext = createContext();

export function InfoProvider({children}) {
  const [trips, setTrips] = useState(null);//all trips for user
  const [invites, setInvites] = useState(null);//all pending invites for user
  const [tripEvents, setTripEvents] = useState(null);//trip events for one trip
  const [tripid, setTripid] = useState(null);//trip id
  const [usersInTrip, setUsersInTrip] = useState([])

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
    // console.log("🍎",userToken);
    setTripid(tripid);
    
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



  const getTrips = async () => {
    try{
      const getTrips = await fetch(`http://${API_URL}:8080/trip`,{
        method:"GET",
        headers: authHeader
      })


      // console.log("🤢", getTrips.status);
      const res = await getTrips.json();
      const obj = res;
      // console.log("🤢", obj.name);

      if(obj !== null) {
        const modified = obj.map((item) => {
          const start_date = moment(item.start_date).format("YYYY-MM-DD");
          const end_date = moment(item.end_date).format("YYYY-MM-DD");
      
          return {
            id: item.id,
            name: item.name,
            start_date: start_date,
            end_date: end_date
          };
        });

        setTrips(modified);
      }

    } catch (e) {
      console.log(`Get Trip Error: ${e}`);
    }
  }

  const getInvites = async () => {
    try{
      const getInvites = await fetch(`http://${API_URL}:8080/invite/`,{
        method:"GET",
        headers: authHeader
      })

       const res = await getInvites.json();
       checkStatus(res,getInvites,setInvites)
      //  if(res){
      //   setInvites(res);
      //  }
      } catch (e) {
        console.log(`Invite Error: ${e}`);
      } 
  }

  const getUsersInTrip = async (tripID) => {
    try{
      const getUsersInTrip = await fetch(`http://${API_URL}:8080/trip/users/${tripID}`,{
        method:"GET",
        headers: authHeader
      })

      const res = await getUsersInTrip.json();
      const usersTrip=[]
      res.forEach(user => {
        usersTrip.push(user.username)
      });
      setUsersInTrip(usersTrip)
    } catch (e) {
      console.log(`Get Users In Trip Error: ${e}`);
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
        console.log(`Accept Invites Error: ${e}`);
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

  const postTrip = async (newTripInput) => {
    try{
      // console.log(newTripInput);
      
      const postTrip = await fetch(`http://${API_URL}:8080/trip`, {
        method:"POST",
        headers: authHeader,
        body:JSON.stringify(newTripInput)
      })

      const res = await postTrip.json();

      checkStatus(res, postTrip, (res) => {
        getTrips();
        return console.log(res);
      })

    }catch(e) {
      console.log(e);
    }
  };

  const postInvite = async (userEmail) => {
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
      getTrips();
      getInvites();
    }
  }, [userData])
  

  return (
    <InfoContext.Provider value={{trips, tripEvents, tripid, invites, usersInTrip, rejectInvites, acceptInvites, getInvites, getTripEvents, postTripEvents, postTrip, getTrips, postInvite, getUsersInTrip}}>
      {children}
    </InfoContext.Provider>
  )
}