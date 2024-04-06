# CS5614-DBMS-ThingsToDoInDC-
## VT CS5614 Graduate Project: Using Google Map API and TicketMaster API to display place to go % events to attend on map near DC area

# Motivation:
## People spend too much time finding places to go to in their leisure time. This project integrates Google Map API and TicketMaster API and displays the spots in map view near DC area
## This is also a final project for CS5614 Database Management System

# Contributors 

## Team Leader
[Zhehao Fan](https://github.com/zhFIsHappy)

## Backend
[Mystery person](https://google.com)

## Frontend
[Tinghui Wu](https://github.com/Oswaldaze)

[Rundong Liang](https://github.com/RundongLiangvt)


# Screenshots
# Main Functionality-Display Places and Events on Map
## Mainpage
![image](https://user-images.githubusercontent.com/94866598/236501372-c2f45e6f-be40-442e-bc37-5c3adaa68d09.png)
## Map View
![image](https://user-images.githubusercontent.com/94866598/236501535-b3ad017b-db0e-46d4-b94a-d6e979e2ec87.png)
## Using Art-garllery type to sort Google Places
![image](https://user-images.githubusercontent.com/94866598/236501698-c03e50ca-a5ce-4276-ba90-6c0d8403294d.png)
## Display the Infowindow after clicking on the places marker
![image](https://user-images.githubusercontent.com/94866598/236502382-ffd4d643-ebe8-4bf2-884a-99206f83734a.png)
## User/Tourist add favorite
![image](https://user-images.githubusercontent.com/94866598/236504059-9ad26bc8-38b9-47d5-8fbf-0bcea097c1b2.png)
## Display the places with rating more than 4.5
![image](https://user-images.githubusercontent.com/94866598/236501829-18a71452-f254-4b4e-8051-3650d70ead69.png)
## Display the events with the type of Sports
![image](https://user-images.githubusercontent.com/94866598/236501959-d0b31460-f1d8-4f93-b8a1-8ca7faea1d93.png)
## Display the Infowindow after clicking on the event marker
![image](https://user-images.githubusercontent.com/94866598/236502101-96c686ae-5c6c-430b-b462-864306754dc7.png)
## Use Date range slider to filter the events
![image](https://user-images.githubusercontent.com/94866598/236502716-734283b8-2092-45df-8db6-caa4ed09b387.png)

# Main Functionality-Display User Click/Like Data
## Display viewed and liked places in the map 
![image](https://user-images.githubusercontent.com/94866598/236503030-2d2866d7-d371-4b10-b865-7c25e6fac5a1.png)
## Display Most Views places by user
![image](https://user-images.githubusercontent.com/94866598/236503230-3043f271-d37c-490a-ae4b-7d28d32668d5.png)
## Display Most Liked places by user
![image](https://user-images.githubusercontent.com/94866598/236503322-2f4b4f07-0c7c-4ed5-9777-3ca337b2455c.png)

#User center- Display userinfo and account management
## Sign up and Login window
![image](https://user-images.githubusercontent.com/94866598/236503508-44b836b0-83b3-4ecd-ab10-f759ba641669.png)
## Logged in in user view
![image](https://user-images.githubusercontent.com/94866598/236504175-b91bf455-227b-4d1a-9347-7fcbc4839064.png)
## User Settings
![image](https://user-images.githubusercontent.com/94866598/236504294-44a8c8bd-11ac-4774-8681-165b4eed51ca.png)




# How to run this project
### 1. Sign up Google Places Api account and Ticketmaster API account
### 2. Sign up mongoDB account
### 3. Replace all personalized link with your own link written in .env
### 4. git clone https://github.com/zhFIsHappy/CS5614-DBMS-Funny-Spots-to-go-Google-Map-API-.git
### 5. cd to the directory && cd to client folder
### 6. npm i (Install all the packages required in frontend for this project)
### 7. cd to server folder 
### 8. npm i (Install all the packages required in backend for this project)
### 9. node scripts/InitGADB && node scripts/InitTMDB
### 10. node index.js (Start backend service)
### 11. cd to client folder && npm start (Start frontend service)

