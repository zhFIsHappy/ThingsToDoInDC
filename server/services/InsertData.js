const {retrieveJson, getAllPlacesDataDB, retrieveDataTM}= require('./RetrieveData')
// const {checkUndefined} = require('../utils/checkUndefined')
const mongoose = require('mongoose')
const db = mongoose.connection;
const GADB = require('../utils/GoogleSchemaApiDB')
const TMDB = require('../utils/TicketMasterApiDB')
const UIDB = require('../utils/UserInfoApiDB')
const { getJSON } = require('./RetrieveData')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const API_KEY = process.env.GoogleMapAPI_KEY
const API_KEYTM = process.env.TicketMasterAPI_KEY

const DEF_DELAY = 2000;
const SHORT_DELAY = 1640;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

let searchParmsDict = {
  "location": "38.9072,-77.0369",
  "radius": "50000",
  "key": API_KEY,
}

let searchParmsDictTM = {
  "location": "38.9072,-77.0369",
  "radius": "155",
  "key": API_KEYTM,
}

let placeIdSet = new Set()
let cnt = 0

// Better not to use this function to init DB!!
// Better not to use this function to init DB!!
// Better not to use this function to init DB!!
// Use scripts/initGADB.js to init GoogleMap DB instead of using this
const InsertGoogleMapPlaceAPIData = async function _() {
  try {
    await GADB.deleteMany({}).then(function(){
      console.log("Data deleted");
    }).catch(function(e){
      console.log(e);
    })
    let url = new URL(process.env.GoogleMapAPI_Nearby_Search);
    // Google map api can result up to 60 results in total, 20 per page

    // DC location
    var typeList = [];
    typeList.push("art_gallery")
    typeList.push("aquarium")
    typeList.push("museum")
    typeList.push("park")
    typeList.push("tourist_attraction")
    typeList.push("zoo")
    typeList.push("shopping_mall")

    for(var i = 0; i < typeList.length; i++){
      console.log("TypeList index", i);
      let tmpDict = Object.assign({}, searchParmsDict);
      tmpDict['type'] = typeList[i];
      url.search = new URLSearchParams(tmpDict);

      let data = await getJSON(url.href);
      console.log(url.href);
      // console.log(data);
      console.log(data.results.length);
      for (let i = 0 ; i < data.results.length; ++i) {
        console.log("***************************");
        console.log(data.results[i].name, data.results[i].place_id);
        await insertPlace(data.results[i]).then((suc) => {
          if(suc) cnt++;
        });
      }
      await sleep(SHORT_DELAY);
      let count = 1;

      console.log(data.next_page_token);
      
      while(data.next_page_token !== undefined && count < 5){
        let pagetoken = data.next_page_token;
        tmpDict['pagetoken'] = pagetoken;
        url.search = new URLSearchParams(tmpDict);
        console.log("--------------------\nCount ", count);
        // console.log(pagetoken);
        // console.log(url.href);
        // console.log(data.results.length);
        data = await getJSON(url.href);
        for (let i = 0 ; i < data.results.length; ++i) {
          console.log("***************************");
          console.log(data.results[i]['name']);
          await insertPlace(data.results[i]);
        }
        count++;
        // console.log(data.next_page_token);
        await sleep(SHORT_DELAY);
      }
      console.log("index", i);
    }
    console.log("End typelist");
    console.log(cnt);
    // process.exit(0);
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
}

async function InsertTicketMasterAPIData(){
  
  try {
    let url = process.env.TicketMasterAPI_Nearby_Search;
    await TMDB.deleteMany({}).then(function(){
      console.log("Data deleted");
    }).catch(function(e){
      console.log(e);
    })
    // Google map api can result up retrieveJsonto 60 results in total, 20 per page
    // console.log(url)
    // DC location
    var typeList = [];
    typeList.push(process.env.TicketMasterAPI_Sports)
    typeList.push(process.env.TicketMasterAPI_Music)
    typeList.push(process.env.TicketMasterAPI_Comedy)
    typeList.push(process.env.TicketMasterAPI_Festival)
    typeList.push(process.env.TicketMasterAPI_Miscellaneous)
    typeList.push(process.env.TicketMasterAPI_ANT)
    typeList.push(process.env.TicketMasterAPI_Family)

    console.log(process.env.TicketMasterAPI_Sports)
    for(let j = 0; j< typeList.length; j++){
      let data = await retrieveJson(typeList[j]);
      console.log(data._embedded.events.length);
      for (let i = 0 ; i < data._embedded.events.length; ++i) {
        let minPrice = undefined
        let maxPrice = undefined
        if (data._embedded.events[i].priceRanges) {
          minPrice = data._embedded.events[i].priceRanges[0].min;
          maxPrice = data._embedded.events[i].priceRanges[0].max
        }
        console.log("***************************");
        console.log(data._embedded.events[i].name);
        await insertTMPlace(data._embedded.events[i], maxPrice, minPrice);
      }
    }
    console.log("End typelist");
  } catch (err) {
    console.error(err);
  }
}

function generatePasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function insertUserInfo(name, email, password, saved_places,watched_places){
  try{
    const user = await UIDB.findOne({ 'mandatory.email': email });
    if (user) {
      const message=`User with email ${email} already exists in database.`;
      console.log(message);
      return { success: false, message };
    }
    const passwordHash = generatePasswordHash(password);
    await UIDB.create({
      mandatory: {
        name:name,
        email: email,
        password: passwordHash,
        settings: {
          search: "both",
          style: "night"
        },
        saved_places: saved_places? saved_places:[],
        watched_places: watched_places? watched_places:[]
      },
    });
    const message='Register Success!';
    console.log(message);
    return { success: true, message };
  }catch(e){
    const message='Failed: Unexcepted Error ' ;
    console.log(message+ e);
    return { success: false, message };
  }
}

async function insertPlace(data){
  try{
    console.log('Processing...');
    if(placeIdSet.has(data.place_id)){
      console.log("Escape for existing", data.place_id, data.name);
      cnt++;
      return false;
    }
    GADB.create({ 
      location: {
        longitude:data.geometry.location.lng,
        latitude:data.geometry.location.lat,
        vicinity:data.vicinity
      },
      mandatory: {
        name:data.name,
        icon:data.icon,
        place_id:data.place_id,
        rating:data.rating? data.rating:0,
        types: data.types? data.types:[]
      },
      optional: {
        
        kind:0, //TODO: Change it with expected field
      },
      op_map: {
        kind:0, //TODO: Change it with expected field
        mapping:"C" //TODO: Change it with expected field
      },
    });
    placeIdSet.add(data.place_id);
    console.log('Insert success');
    return true;
  }catch(e){
    console.log('Failed: ' + e);
    return false;
  }
}
function checkUndefined(variable){
    if(typeof(variable) === 'undefined'){
        return "";
    }else{
        return variable;
    }
}

const insertTMPlace = async function _(data, maxPriceValue, minPriceValue){
  try{
    console.log('Processing...');
    // if(maxPriceValue !== -1 && minPriceValue !== -1){
    //   dict.optional.add({
    //     "price":{
    //       "maxPrice": maxPriceValue,
    //       "minPrice": minPriceValue
    //     }
    //   })
    // }
    TMDB.create({ 
      location: {
        longitude:parseFloat(data._embedded.venues[0].location.longitude),
        latitude:parseFloat(data._embedded.venues[0].location.latitude),
        vicinity:data._embedded.venues[0].address.line1,
        name:data._embedded.venues[0].name,
      },
      mandatory: {
        name:data.name,
        event_id:data.id,
        start_date:data.dates.start.localDate,
        types: [
          data.classifications[0].segment.name, 
          data.classifications[0].genre.name
        ]
      },
      optional: {
        url:data.url,
        info:data.info,
        maxTicketPrice:maxPriceValue,
        minTicketPrice:minPriceValue,
        img_url:data.images[0].url,
        // ticketMinPrice: minPrice,
        // ticketMaxPrice: maxPrice,
        // timeZone : timeZone,
        // ticketInfo : ticketInfo,
        kind:0, //TODO: Change it with expected field
      },
      op_map: {
        kind:0, //TODO: Change it with expected field
        mapping:"C" //TODO: Change it with expected field
      },
    });
    console.log('Insert success');
    // process.exit(0);
  }catch(e){
    console.log('Failed: ' + e);
    // process.exit(1);
  }
}

// InsertGoogleMapPlaceAPIData();
// module.exports = insertPlace;
// InsertTicketMasterAPIData()
module.exports = insertUserInfo

