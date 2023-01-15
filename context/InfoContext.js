import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API_URL from "../config";
import moment from 'moment';

export const InfoContext = createContext();

export function InfoProvider({children}) {
  const [trips, setTrips] = useState(null);//all trips for user
  const [tripEvents, setTripEvents] = useState(null);//trip events for one trip
  const [tripid, setTripid] = useState(null);//trip id
  const [userid, setUserid] = useState(null);//user id


  const { userData, userToken } = useContext(AuthContext)
  // console.log("🍏",userData)
  // to fetch trip data we only need current user token 

  // Trips
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

  // useEffect(() => {
  //   sortTripByDate(tripData[2])
  //   // console.log(sortTripByDate(tripData[2]));
  // },[])

  // Timeline
  // get timeline data for one trip
  const getTripEvents = async (tripid) => {
    // console.log("🍎",tripid);
    // console.log("🍎",userToken);
    
    const tripEvents = await fetch(`http://${API_URL}:8080/timeline/${tripid}`,{
      method:"GET",
      headers: {
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    })
    const res = await tripEvents.json();
    setTripEvents(res);
    setTripid(tripid);
    
    // return res
  }

  const postTripEvents = async (tripEventInput) => {
    tripEventInput.tripid = tripid
    // console.log("🍋",tripEventInput);
    const postTripEvents = await fetch(`http://${API_URL}:8080/timeline/create`, {
      method:"POST",
      headers: {
        'Accept': 'application/json, text/plain, */*', 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body:JSON.stringify(tripEventInput)
    })
    const res = await postTripEvents.json();
    //return updated list of trips?
    getTripEvents(tripid)
    // console.log(res);
  }

  const postNewTrip = async (newTripInput) => {
    try{
      console.log(newTripInput);
      setUserid(newTripInput.userid);
      console.log(userid);
      
      const postNewTrip = await fetch(`http://${API_URL}:8080/trip`, {
        method:"POST",
        headers: {
          'Accept': 'application/json, text/plain, */*', 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body:JSON.stringify(newTripInput)
      })
      const res = await postNewTrip.json();
      console.log(res);
    }catch(e) {
      console.log(e);
    }
    
  }

  const getTrips = async () => {
    try{
      const getTrips = await fetch(`http://${API_URL}:8080/trip`,{
        method:"GET",
        headers: {
          'Accept': 'application/json, text/plain, */*', 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
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

    }catch (e) {
      console.log(e);
    }
  }


  useEffect(() => {

    if(userData){
      // setTrips(tripData[2])
      // setTripEventDB(tripEventDBData)
      getTrips();
    }
  }, [])
  

  return (
    <InfoContext.Provider value={{trips, tripEvents, getTripEvents, postTripEvents, postNewTrip, getTrips}}>
      {children}
    </InfoContext.Provider>
  )
}