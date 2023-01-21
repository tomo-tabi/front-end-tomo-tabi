import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { AuthContext } from "./AuthContext";
import { checkStatus } from "../utils/fetchUtils";
import API_URL from "../config";
import moment from 'moment';

export const TripContext = createContext();

export function TripProvider({children}) {
  const { userData, authHeader } = useContext(AuthContext);
 
  const [trips, setTrips] = useState(null);//all trips for user
  const [usersInTrip, setUsersInTrip] = useState([])
  
  const getTrips = async () => {
    // console.log("authHead", authHeader)
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
      console.log(`Post Trip Error: ${e}`);
    }
  };


  useEffect(() => {
    if(userData){
      getTrips();
    }
  }, [userData])


  
  return (
    <TripContext.Provider value={{trips, usersInTrip, postTrip, getTrips, getUsersInTrip}}>
      {children}
    </TripContext.Provider>
  )
}