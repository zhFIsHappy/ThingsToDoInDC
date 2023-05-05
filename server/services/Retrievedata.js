const https = require('https')
require('dotenv').config()

const GADB = require('../utils/GoogleSchemaApiDB')
const TMDB = require('../utils/TicketMasterApiDB')
const UIDB = require('../utils/UserInfoApiDB')
const getJSON = async function _(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          data = JSON.parse(data);
        } catch (err) {
          reject(err);
        }
        resolve(data);
      });
    }).on('error', err => {
      reject(err);
    });
  });
}
console.log(process.env.TicketMasterAPI_Nearby_Search)

const getAllPlacesDataFromDB = async function _() {
  return GADB.find({});
}

const getPlaceDataByType = async function _(type) {
  return GADB.find({ 'mandatory.types': { $in: [type] } });
}

const getPlaceByTypeAndRating = async function _(type, rating, desc){
  console.log(type, rating, desc);
  return GADB.find({ 'mandatory.rating' : { $gte: Number(rating) }, 'mandatory.types': { $in: [type] }})
            .sort({ 'mandatory.rating' : desc === "0"? 1:-1 });
}

const getPlaceDataByRating = async function _(rating, desc) {
  return GADB.find({ 'mandatory.rating' : { $gte: Number(rating) }})
            .sort({ 'mandatory.rating' : desc === "0"? 1:-1 });
}


// Events Data

const getAllEvents = async function _() {
  return TMDB.find({});
}

const getEventsByType = async function _(type) {
  return TMDB.find({ 'mandatory.types': { $in: [type] } , 'mandatory.start_date': { $gte: new Date()}})
    .sort({'mandatory.start_date': 1});
}

const getEventsMapToPlace = async function _(type) {
  let idMap = new Map();
  let res = []
  await TMDB.find({}).then(function(events){
    let id = 0;
    events.forEach(element => {
      // console.log(element)
      let vicinity = element.location.vicinity;
      if(idMap.get(vicinity) === undefined){
        ++id;
        idMap.set(vicinity, id);
        res.push({
          'id': id,
          eventsList: []
        });
      }
      res[idMap.get(vicinity) - 1].eventsList.push(element);
    });
  });
  // console.log(res)
  // const data = TMDB.find({});
  // console.log(data);
  // for(let i = 0; i < data.length && i < 10; ++i){
  //   console.log(data[i]);
  // }
  return res;
}

async function getUserInfo(email, password){
  try {
        const user = await UIDB.find({ 'mandatory.email': email });
        if (user) {
          if (password=== user[0].mandatory.password) {
            return 200;
          } else {
            return 400;
          }
        } else {
          return 400;
        }
      } catch (error) {
        return 400
      }
}

const retrieveJson = async function _(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          data = JSON.parse(data);
        } catch (err) {
          reject(err);
        }
        resolve(data);
      });
    }).on('error', err => {
      reject(err);
    });
  });
}


const getEventsByDateRange = async function _(startDate, endDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  const events = await TMDB.find({
    "mandatory.start_date": {
      $gte: start.toISOString(),
      $lte: end.toISOString()
    }
  }).sort({ "mandatory.start_date": 1 });
  return events;
};


module.exports = {
  getJSON,
  getAllPlacesDataFromDB,
  getPlaceByTypeAndRating,
  getPlaceDataByType,
  retrieveJson,
  getPlaceDataByRating,
  getAllEvents,
  getEventsMapToPlace,
  getEventsByType,
  getUserInfo,
  getEventsByDateRange
};
