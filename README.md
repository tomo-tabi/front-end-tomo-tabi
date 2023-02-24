<div align="center">
<h1>TomoTabi</h1>
<p>
  <img src="https://user-images.githubusercontent.com/92072255/202832595-d6e2f2b4-c70d-4f8d-9964-660931ad9b20.svg" width="100" alt="Internet Logs logo by Yoon Ju Kim"/>
</p>
<a href="https://play.google.com/store/apps/details?id=com.tomotabi.TomoTabi">TomoTabi</a>, is a multiuser trip planning app for Android.
x
</div>

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
    - [Setup](#setup)
    - [How to set up knexfile](#how-to-set-up-knexfile)
    
# Introduction  
[Internet Logs](https://internet-logs.onrender.com), allows users to write journal entrys for inidivual days, upload images with the journal entry, and create events for the day. On login, they can see all of their events for the month in a monthly calendar view. Users can navigate to day views by clicking the dates on the calendar to view their journal and images, along side the day's events. 
<br/>
[Internet Logs](https://internet-logs.onrender.com) uses JavaScript with React, [React-Calendar](https://www.npmjs.com/package/react-calendar), and [React-Color](https://www.npmjs.com/package/react-color) to render UI/UX components. The backend uses Express.js, Node.js, and Knex.js to create a REST API server. The database is built with PostgreSQL. Images are hosted on [Cloudinary](https://cloudinary.com/).

# Features

| Write Journal| Create and edit events with types | View Events of the Month |
| ------------- | ------------- |------------- |
|<img height="200" alt="image" src="https://user-images.githubusercontent.com/92072255/202834345-5eef8b77-89ca-49aa-84d6-98061dbef0f7.png"> | <img height="200" border-radious="4px" alt="Event Create and Edit" src="https://user-images.githubusercontent.com/92072255/202833855-dcfebd7f-7265-4ce1-b4d5-14c9333a3814.png">  | <img height="200" alt="Calendar View" src="https://user-images.githubusercontent.com/92072255/202834269-71a3e74b-44ef-4fbe-9077-0872df8a766a.png">|


| Upload Image | Focus on Today's Date | Change Color of Events |
|---|---|---|
| <img height="240" alt="image" src="https://user-images.githubusercontent.com/92072255/202834569-c693bfe0-ebdf-4bbb-a1a3-91d3cc315596.png"> | <img height="250" src="https://user-images.githubusercontent.com/92072255/202834856-f7c4571b-6c9b-4372-b2ce-d8938800a4c6.gif"> | <img height="240" src="https://user-images.githubusercontent.com/92072255/202834923-17304023-23ed-49d4-b3c0-0e35b6d42cb9.gif"> |

# Getting Started
## :sparkles: Prerequisite :sparkles:
* Install [Android Studio](https://developer.android.com/studio?gclid=Cj0KCQiAutyfBhCMARIsAMgcRJSuW_PhqH74Pp3PwT7UkJ1YFgJbEnxRYS4PLQdmqmW-gcaBjrnejPIaAmDTEALw_wcB&gclsrc=aw.ds)
* Create an android virtual device
* Install [Node.js](https://nodejs.org/en/)
* Create [Cloudinary](https://cloudinary.com/) account and make a file for the project in Media Library
  * Set up Upload presets to connect with created file

# Setup
Run the following command in the root folder to install dependencies  
```js
npm install
```  
Then run the following code:
```
npm run android
 ```
Then press
* a (for Android)
* i (for iOS simulator)

Once this is done, change the directory to ```./frontend``` and install the frontend dependencies
```js
cd frontend
npm install
```  
Start the react app by running the following in ```./frontend```  
```js
npm start
```  
# How to set up knexfile
```knexfile.js```file can be found in ```./backend/db```

You will need to set up a ```.env.local``` file in the root folder which contains the following variables:  
```
DB_USER=<your_db_username>
DB_NAME=<your_db_name>
DB_PASSWORD=<your_db_password>
NODE_ENV=development
CLOUDINARY_NAME=<found_in_dashboard_product_environment_credentials>
CLOUDINARY_API_KEY=<found_in_dashboard_product_environment_credentials>
CLOUDINARY_API_SECRET=<found_in_dashboard_product_environment_credentials>
```  
Add your ```.env.local``` to the ```.gitignore``` file in the root folder to avoid your sensitive data from being pushed to github

# front-end-tomo-tabi
Start your emulator.


