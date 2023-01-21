import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { AuthContext } from "./AuthContext";
import API_URL from "../config";
import moment from 'moment';

export const TripContext = createContext();

export function TripProvider({children}) {
  const [trips, setTrips] = useState(null);//all trips for user
  // const [invites, setInvites] = useState(null);//all pending invites for user
  // const [tripEvents, setTripEvents] = useState(null);//trip events for one trip
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
    
    const getTrips = async () => {
      try{
        const getTrips = await fetch(`http://${API_URL}:8080/trip`,{
          method:"GET",
          headers: authHeader
        })
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
        console.log(`Get Users in Trip Error: ${e}`);
      } 
    } 
  
    const postNewTrip = async (newTripInput) => {
      try{
        // console.log(newTripInput);
        
        const postNewTrip = await fetch(`http://${API_URL}:8080/trip`, {
          method:"POST",
          headers: authHeader,
          body:JSON.stringify(newTripInput)
        })
  
        const res = await postNewTrip.json();
  
        checkStatus(res, postNewTrip, (res) => {
          getTrips();
          return console.log(res);
        })
  
      }catch(e) {
        console.log(`Post Trip Error: ${e}`);
      }
    };


  useEffect(() => {
    if(userData){
      getTrips();
    }
  }, [userData])
  
  
    
    return (
      <TripContext.Provider value={{trips, usersInTrip, postNewTrip, getTrips, getUsersInTrip}}>
        {children}
      </TripContext.Provider>
    )
  }