import { Alert } from "react-native";

export const userPostOpt = (input) => {
  return {
    method:"POST",
    headers: {
      'Accept': 'application/json, text/plain, */*', 
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(input)
  }
}

export const userCheckStatus = (res, req, setFunc) => {
  // console.log("user status",req.status);
  if (req.status === 200 || req.status === 201) {
    setFunc(res)
  } else {
    Alert.alert(res.message)
  }
}

// for post requests status will be 201 reflect that in code
// -> get rid of anonymous functions in: postTripEvents, postExp, acceptInvites, 
// rejectInvites, postInvite, postTrip
//

export const checkStatus = async (req, setFunc) => {

  if (req.status === 404) {
    // console.log("404 stat",res.url);
    // need to reset trips (to be added?)
    return
  }

  const res = await req.json();

  if (req.status === 200) {
    setFunc(res);
  } else {
    // 500 & 201
    Alert.alert(res.message);
  }
}

export const sendStatus = async (req, getFunc, input) => {
  // for update, edit, and delete
  if (req.status === 201 || req.status === 200) {
    //re render
    getFunc(input);
  } else {
    // 500
    const res = await req.json();
    checkStatus(res, req)
  }
}