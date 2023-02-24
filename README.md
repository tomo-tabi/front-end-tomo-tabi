<div align="center">
<h1>TomoTabi</h1>
<p>
  <img src="https://user-images.githubusercontent.com/92072255/221075109-f2383e44-a6a0-40a8-9ae7-5918b48e57ab.png" width="200" alt="TomoTabi logo by Yoon Ju Kim"/>

</p>
<a href="https://play.google.com/store/apps/details?id=com.tomotabi.TomoTabi">TomoTabi</a>, a multi-user trip planning app for Android
</div>

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
    - [Setup](#setup)
    - [How to set up knexfile](#how-to-set-up-knexfile)
    
# Introduction  
[TomoTabi](https://play.google.com/store/apps/details?id=com.tomotabi.TomoTabi), allows multiple users to plan a trip together. For each trip planned it has a day timeline tab, calendar tab, expenses tab, and trip management tab. 
* On login, users can view current, past, and future trips. 
* For each trip event users can vote their attendance status and filter events based on their vote status
* Expenses tabs enable users to record individual expenses and calculates money owed for each user

# Features
## Screens
| Login | Signup | Profile | Trip Page |
| ------------- | ------------- | ------------- | ------------- |
| <img height="400" alt="login screen" src="https://user-images.githubusercontent.com/92072255/221078897-f3c34f31-97bb-4d17-97a2-338c2fcaf16b.png"> | <img height="400" alt="signup screen" src="https://user-images.githubusercontent.com/92072255/221078906-f53a54b5-d347-476b-af6e-39224f564d9e.png">  | <img height="400" alt="profile screen" src="https://user-images.githubusercontent.com/92072255/221078914-285ba936-6a3e-45b8-a24f-a6ecbb7ba17b.png"> | <img height="400" alt="trip page" src="https://user-images.githubusercontent.com/92072255/221079630-48c4bae3-51ea-43c6-80a3-315ba717cd96.png"> |

| Day Timeline | Calendar | Expenses |
|---|---|---|
| <img height="400" alt="day timline page" src="https://user-images.githubusercontent.com/92072255/221079638-ba44b110-fbf0-4841-a117-fabf92a37873.png"> | <img height="400" alt="Calendar page" src="https://user-images.githubusercontent.com/92072255/221079639-10249d1c-7c17-448a-994f-e67a921021d5.png"> | <img height="400" alt="Expenses page" src="https://user-images.githubusercontent.com/92072255/221079642-930d545d-c6a5-4ab1-9b33-86248ef0c249.png"> |

## Functions
<table> 
  <tr>
    <th colspan=3> Voting</th>
   </tr>
  <tr>
    <td> <img height="400" alt="vote page" src="https://user-images.githubusercontent.com/92072255/221082756-fd50a0b6-a17a-4f05-aada-c289f9b3f6fa.png"> </td> 
    <td> <img height="400" alt="vote result" src="https://user-images.githubusercontent.com/92072255/221082763-deea9941-2934-4969-97fc-0f8f87cf4e9e.png"> </td> 
    <td> <img height="400" alt="vote filter" src="https://user-images.githubusercontent.com/92072255/221082768-5251ad6a-c832-4f98-9753-bbd2239336a6.png"> </td> 
  </tr> 
 </table>
 
 <table> 
  <tr>
    <th colspan=2> Invite</th> <th colspan=2> Balance</th>
   </tr>
  <tr>
    <td> <img height="400" alt="invite pending" src="https://user-images.githubusercontent.com/92072255/221083101-05d3cfa2-28a4-4503-98b5-ac8da2ce40d8.png"> </td> 
    <td> <img height="400" alt="receive invite" src="https://user-images.githubusercontent.com/92072255/221083108-c4bcd2a1-ec1a-4152-8fe5-b4f4e5a4f39f.png"> </td> 
    <td> <img height="400" alt="balance table" src="https://user-images.githubusercontent.com/92072255/221083185-a3cae92a-fb02-4fb0-9cb1-85d4e776cc3b.png"> </td> 
    <td> <img height="400" alt="payment options" src="https://user-images.githubusercontent.com/92072255/221083189-27f0b654-7db2-4d43-853a-55304a88c3e9.png"> </td> 
    
  </tr> 
 </table>

# Getting Started
## :sparkles: Prerequisite :sparkles:
* Install [Android Studio](https://developer.android.com/studio?gclid=Cj0KCQiAutyfBhCMARIsAMgcRJSuW_PhqH74Pp3PwT7UkJ1YFgJbEnxRYS4PLQdmqmW-gcaBjrnejPIaAmDTEALw_wcB&gclsrc=aw.ds)
* Create an android virtual device

# Setup
Run the following command in the root folder to install dependencies  
```js
npm install
```  
Then run the following code:
```
npm run android
 ```
Then press ```a (for Android)``` to run the app
