const { getJSON }= require('../services/RetrieveData');
const mongoose = require('mongoose')
const GADB = require('../utils/GoogleSchemaApiDB')

const API_KEY = process.env.GoogleMapAPI_KEY

const DEF_DELAY = 2000;
const SHORT_DELAY = 1640;

// 0.1 lng/lat = 11km
// 1 lng/lat = 1000000

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

function calculateDistanceByLngLat(lng1, lat1, lng2, lat2) {
    let x = Math.abs(lng1 - lng2) * 1000000;
    let y = Math.abs(lat1 - lat2) * 1000000;
    let dist = Math.sqrt(x * x + y * y)
    return dist
}

function calculateLngLatByDistance(lng, lat, dis, alpha) {
    let x = dis * Math.cos(Math.PI / 180 * alpha)
    let y = dis * Math.sin(Math.PI / 180 * alpha)
    console.log(alpha, Math.cos(Math.PI / 180 * alpha), Math.sin(Math.PI / 180 * alpha))
    console.log(x, y)
    // if (Math.abs(x) < 1e-6) x = 0;
    // if (Math.abs(y) < 1e-6) y = 0;
    let resLng = lng + (x / 100000)
    let resLat = lat + (y / 100000)
    return {resLng, resLat}
}

let searchParamsDict = {
  "location": "38.9072,-77.0369",
  "radius": "2500",
  "key": API_KEY,
}

let placeIdSet = new Set()
let cnt = 0

const makeParamsDict = async function _(lng, lat){
    let searchParamsDict = {
        "location": "38.9072,-77.0369",
        "radius": "2500",
        "key": API_KEY,
    }
    let params = Object.assign({}, searchParamsDict);
    return params;
}

async function clearTable() {
    await GADB.deleteMany({}).then(function(){
        console.log("Data deleted");
    }).catch(function(e){
        console.log(e);
    })
}

let fit = 0

const InsertGoogleMapPlaceAPIData = async function _(params, typeList) {
  try {
    let url = new URL(process.env.GoogleMapAPI_Nearby_Search);
    // Google map api can result up to 60 results in total, 20 per page

    // DC location
    for(var i = 0; i < typeList.length; i++){
      console.log("TypeList index", i);
      let tmpDict = Object.assign({}, params);
      tmpDict['type'] = typeList[i];
      if(typeList[i] === "zoo" || typeList[i] === "aquarium") {
        tmpDict['keyword'] = typeList[i];
      }
      if(typeList[i] === "aquarium"){
        tmpDict.radius = "300000";
      }
      url.search = new URLSearchParams(tmpDict);

      let data = await getJSON(url.href);
      console.log(url.href);
      // console.log(data);
      console.log(data.results.length);
      for (let i = 0 ; i < data.results.length; ++i) {
        console.log("***************************");
        console.log(data.results[i].name, data.results[i].place_id);
        let fl = false;
        if(data.results[i].types){
            for(let k = 0; k < data.results[i].types.length; ++k){
                if(filterTypesSet.has(data.results[i].types[k])){
                    fl = true;
                    break;
                }
            }
        }
        if(fl){
            ++fit;
            continue;
        }
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
    console.log(fit);
    // process.exit(0);
  } catch (err) {
    console.error(err);
    // process.exit(1);
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

let typeList = [];
typeList.push("art_gallery")
typeList.push("aquarium")
typeList.push("museum")
typeList.push("park")
typeList.push("tourist_attraction")
typeList.push("zoo")
typeList.push("shopping_mall")


let filterTypesSet = new Set();
filterTypesSet.add("pet_store")
filterTypesSet.add("department_store")

// init DB by center of lng & lat, radius of the circle = dis * 4
const init = async function _(rad, dis){
    clearTable()
    const lng = 38.9072, lat = -77.0369
    let cnt = 360 / rad
    console.log(cnt)
    for(let i = 0; i < cnt; ++i){
        const res = calculateLngLatByDistance(lng, lat, dis, rad * i);
        // const res = calculateLngLatByDistance(lng, lat, rad * i, dis);
        console.log(`${res.resLng},${res.resLat}`);
        let params = {
            "location": `${res.resLng},${res.resLat}`,
            "radius": dis * 1.5,
            "key": API_KEY,
        }
        InsertGoogleMapPlaceAPIData(params, typeList);
        // console.log(calculateLngLatByDistance(lng, lat, rad * i, dis));
    }
    rad = rad / 2
    cnt = 360 / rad
    for(let i = 0; i < cnt; ++i){
        const res = calculateLngLatByDistance(lng, lat, dis * 3, rad * i);
        // const res = calculateLngLatByDistance(lng, lat, rad * i, dis * 3);
        console.log(`${res.resLng},${res.resLat}`);
        let params = {
            "location": `${res.resLng},${res.resLat}`,
            "radius": dis * 1.5,
            "key": API_KEY,
        }
        InsertGoogleMapPlaceAPIData(params, typeList);
        // console.log(calculateLngLatByDistance(lng, lat, rad * i, dis));
    }
    // InsertGoogleMapPlaceAPIData(typeList);
}


function test(rad, dis) {
    const lng = 38.9072, lat = -77.0369
    // const lng = 0, lat = 0
    let cnt = 360 / rad
    console.log(cnt)
    for(let i = 0; i < cnt; ++i){
        console.log(rad * i, i, calculateLngLatByDistance(lng, lat, dis, rad * i));
    }
    console.log("Expand")
    rad = rad / 2
    cnt = 360 / rad
    console.log(cnt)
    for(let i = 0; i < cnt; ++i){
        console.log(rad * i, i, calculateLngLatByDistance(lng, lat, dis * 3, rad * i));
    }
}


// init(45, 3000)

// test(45, 3000);

// InsertGoogleMapPlaceAPIData();


