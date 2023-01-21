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

export const checkStatus = (res, req, setFunc) => {
  if (req.status === 404) {
    // console.log("404 stat",res.url);
    // need to reset trips (to be added?)
    return
  }
  if (req.status === 200) {
    setFunc(res);
  } else {
    // 500 & 201
    Alert.alert(res.message);
  }
}