import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { EventContext } from "./EventContext";
import { checkStatus, sendStatus } from "../utils/fetchUtils";
import API_URL from "../config";
import moment from 'moment';

export const VoteContext = createContext();

export function VoteProvider({children}) {
  const { userData, authHeader } = useContext(AuthContext);
  const { tripid } = useContext(EventContext);
  
  const [votes, setVotes] = useState(null);//{ [ { username, vote } ], numOfYesVotes, numOfNoVotes, numNotVoted }
  const [userVote, setUserVote] = useState(null);//get user's votes

  const getVotes = async (eventid) => {//all votes
    try{

      const getVotes = await fetch(`http://${API_URL}:8080/vote/${eventid}`,{
        method:"GET",
        headers: authHeader,
      });


      if (getVotes.status === 404) {//need?
        setVotes(null);
        return
      };
      

      checkStatus(getVotes, setVotes);

    } catch (e) {
      console.log(`Get Votes Error: ${e}`);
    }
  };

  const getUserVote = async (eventid) => {//all votes
    try{

      const getUserVote = await fetch(`http://${API_URL}:8080/vote/${eventid}/user`,{
        method:"GET",
        headers: authHeader,
      });

      if (getUserVote.status === 404) {//need?
        setVotes(null);
        return
      };

      checkStatus(getUserVote, setUserVote);

    } catch (e) {
      console.log(`Get User Votes Error: ${e}`);
    }
  };

  const postYesVote = async (eventid) => {//all votes
    try{

      const postYesVote = await fetch(`http://${API_URL}:8080/vote/yes/${eventid}`,{
        method:"POST",
        headers: authHeader,
      });

      sendStatus(postYesVote, () => {
        getVotes(eventid);
        getUserVote(eventid);
        return
      });

    } catch (e) {
      console.log(`Post Yes Votes Error: ${e}`);
    }
  };

  const postNoVote = async (eventid) => {//all votes
    try{

      const postNoVote = await fetch(`http://${API_URL}:8080/vote/no/${eventid}`,{
        method:"POST",
        headers: authHeader,
      });

      sendStatus(postNoVote, () => {
        getVotes(eventid);
        getUserVote(eventid);
        return
      });

    } catch (e) {
      console.log(`Post No Votes Error: ${e}`);
    }
  };

  return (
    <VoteContext.Provider value={{ votes, userVote, getVotes, getUserVote, postYesVote, postNoVote }}>
      {children}
    </VoteContext.Provider>
  )
};