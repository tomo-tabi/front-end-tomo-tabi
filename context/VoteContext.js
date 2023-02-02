import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { EventContext } from './EventContext';
import { checkStatus, sendStatus } from '../utils/fetchUtils';
import API_URL from '../config';
import moment from 'moment';

export const VoteContext = createContext();

export function VoteProvider({ children }) {
  const { userData, authHeader } = useContext(AuthContext);
  const { tripid } = useContext(EventContext);
  
  const [votes, setVotes] = useState(null); //{ [ { username, email, vote } ], numOfYesVotes, numOfNoVotes, numNotVoted }
  const [userVote, setUserVote] = useState(null); //get user's votes
  const [tripVote, setTripVote] = useState(null); //get all votes in trip

  const getVotes = async eventid => {
    //all votes
    try {
      const getVotes = await fetch(`${API_URL}/vote/${eventid}`, {
        method: 'GET',
        headers: authHeader,
      });

      if (getVotes.status === 404) {
        //need?
        setVotes(null);
        return;
      }

      checkStatus(getVotes, setVotes);
    } catch (e) {
      console.log(`Get Votes Error: ${e}`);
    }
  };

  const getUserVote = async eventid => {
    try {
      const getUserVote = await fetch(`${API_URL}/vote/${eventid}/user`, {
        method: 'GET',
        headers: authHeader,
      });

      if (getUserVote.status === 404) {
        //need?
        setVotes(null);
        return;
      }

      checkStatus(getUserVote, setUserVote);
    } catch (e) {
      console.log(`Get User Votes Error: ${e}`);
    }
  };

  const getTripVotes = async tripid => {
    try {
      const getTripVotes = await fetch(`${API_URL}/vote/tripVotes/${tripid}`, {
        method:'GET',
        headers: authHeader,
      });

      if (getTripVotes.status === 404) {
        return setTripVote(null);
      };

      checkStatus(getTripVotes, setTripVote);

    } catch (e) {
      console.log(`Get Trip Votes Error: ${e}`);
    }
  }

  const postYesVote = async eventid => {
    try {
      const postYesVote = await fetch(`${API_URL}/vote/yes/${eventid}`, {
        method: 'POST',
        headers: authHeader,
      });

      sendStatus(postYesVote, () => {
        getVotes(eventid);
        getUserVote(eventid);
        return;
      });
    } catch (e) {
      console.log(`Post Yes Votes Error: ${e}`);
    }
  };

  const postNoVote = async eventid => {
    try {
      const postNoVote = await fetch(`${API_URL}/vote/no/${eventid}`, {
        method: 'POST',
        headers: authHeader,
      });

      sendStatus(postNoVote, () => {
        getVotes(eventid);
        getUserVote(eventid);
        return;
      });
    } catch (e) {
      console.log(`Post No Votes Error: ${e}`);
    }
  };

  const updateYesVote = async (eventid, voteid) => {
    //all votes
    try {
      const updateYesVote = await fetch(`${API_URL}/vote/yes/${voteid}`, {
        method: 'PUT',
        headers: authHeader,
      });

      sendStatus(updateYesVote, () => {
        getVotes(eventid);
        getUserVote(eventid);
        return;
      });
    } catch (e) {
      console.log(`Update Yes Votes Error: ${e}`);
    }
  };

  const updateNoVote = async (eventid, voteid) => {
    try {
      const updateNoVote = await fetch(`${API_URL}/vote/no/${voteid}`, {
        method: 'PUT',
        headers: authHeader,
      });

      sendStatus(updateNoVote, () => {
        getVotes(eventid);
        getUserVote(eventid);
        return;
      });
    } catch (e) {
      console.log(`Update No Votes Error: ${e}`);
    }
  };

  return (
    <VoteContext.Provider
      value={{
        votes,
        userVote,
        tripVote,
        getVotes,
        getUserVote,
        getTripVotes,
        postYesVote,
        postNoVote,
        updateYesVote,
        updateNoVote,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
}
