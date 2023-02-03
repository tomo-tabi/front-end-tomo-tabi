import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { checkStatus, sendStatus } from '../utils/fetchUtils';
import API_URL from '../config';
import moment from 'moment';

export const TripContext = createContext();

export function TripProvider({ children }) {
  const { userData, authHeader } = useContext(AuthContext);

  const [trips, setTrips] = useState(null); //all trips for user
  const [usersInTrip, setUsersInTrip] = useState([]);
  const [permission, setPermission] = useState(false)
  const [owner, setOwner] = useState(false)


  const getTrips = async () => {
    // console.log("authHead", authHeader)
    try {
      const getTrips = await fetch(`${API_URL}/trip`, {
        method: 'GET',
        headers: authHeader,
      });
      const res = await getTrips.json();
      const obj = res;
      // console.log("🤢", obj.name);

      if (obj !== null) {
        const modified = obj.map(item => {
          const start_date = moment(item.start_date).format('YYYY-MM-DD');
          const end_date = moment(item.end_date).format('YYYY-MM-DD');

          return {
            id: item.id,
            name: item.name,
            start_date: start_date,
            end_date: end_date,
          };
        });

        setTrips(modified);
      }
    } catch (e) {
      console.log(`Get Trip Error: ${e}`);
    }
  };

  const getUsersInTrip = async tripID => {
    //maybe move to event context
    try {
      const getUsersInTrip = await fetch(`${API_URL}/trip/users/${tripID}`, {
        method: 'GET',
        headers: authHeader,
      });
      // console.log(getUsersInTrip.status);

      if (getUsersInTrip.status === 404) {
        //need to reset for calendar
        return setUsersInTrip(null);
      }

      checkStatus(getUsersInTrip, setUsersInTrip);

      // const res = await getUsersInTrip.json();
      // // console.log(res);
      // const usersTrip=[]
      // res.forEach(user => {
      //   usersTrip.push(user.username)
      // });
      // setUsersInTrip(usersTrip)
    } catch (e) {
      console.log(`Get Users in Trip Error: ${e}`);
    }
  };

  const postTrip = async newTripInput => {
    try {
      // console.log(newTripInput);

      const postTrip = await fetch(`${API_URL}/trip`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify(newTripInput),
      });

      sendStatus(postTrip, getTrips);
    } catch (e) {
      console.log(`Post Trip Error: ${e}`);
    }
  };

  const editTrip = async TripInput => {
    try {
      // console.log(newTripInput);

      const editTrip = await fetch(`${API_URL}/trip/${TripInput.id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify(TripInput),
      });

      sendStatus(editTrip, getTrips);
    } catch (e) {
      console.log(`Edit Trip Error: ${e}`);
    }
  };

  const deleteTrip = async TripInput => {
    try {
      // console.log(newTripInput);

      const deleteTrip = await fetch(`${API_URL}/trip/${TripInput.id}`, {
        method: 'DELETE',
        headers: authHeader,
        body: JSON.stringify(TripInput),
      });

      sendStatus(deleteTrip, getTrips);
    } catch (e) {
      console.log(`Delete Trip Error: ${e}`);
    }
  };

  const checkPermission = async (tripID) => {

    try {
      const checkPermissionRes = await fetch(`${API_URL}/trip/${tripID}/locked`, {
        method: 'GET',
        headers: authHeader,
      });

      const res = await checkPermissionRes.json()

      setPermission(res)

    } catch (e) {
      console.log(`Check Permission Error: ${e}`);
    }
  };

  const checkOwner = async (tripID) => {
    try {
      const checkOwnerRes = await fetch(`${API_URL}/trip/${tripID}/owner`, {
        method: 'GET',
        headers: authHeader,
      });

      const res = await checkOwnerRes.json()

      console.log("res", res)

      setOwner(res)

    } catch (e) {
      console.log(`Check Owner Error: ${e}`);
    }
  };

  const lockTrip = async (tripID) => {
    try{
      console.log(tripID.tripid);
      const lockTrip = await fetch(`${API_URL}/trip/${tripID.tripid}/lock`, {
      method: 'PUT', 
      headers: authHeader,
    });
      sendStatus(lockTrip, getTrips);

    }catch (e) {
      console.log(`lockTrip Error: ${e}`);
    }
  };

  const unlockTrip = async (tripID) => {
    try{
      console.log(tripID.tripid);
      const unlockTrip = await fetch(`${API_URL}/trip/${tripID.tripid}/unlock`, {
      method: 'PUT', 
      headers: authHeader,
    });
      sendStatus(unlockTrip, getTrips);

    }catch (e) {
      console.log(`unlockTrip Error: ${e}`);
    }
  };

  useEffect(() => {
    if (userData) {
      getTrips();
    }
  }, [userData]);

  return (
    <TripContext.Provider
      value={{
        trips,
        usersInTrip,
        postTrip,
        getTrips,
        getUsersInTrip,
        editTrip,
        deleteTrip,
        checkPermission,
        permission,
        checkOwner,
        owner,
        lockTrip,
        unlockTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
}
