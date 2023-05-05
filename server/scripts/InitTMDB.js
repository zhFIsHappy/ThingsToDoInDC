const { getJSON }= require('../services/RetrieveData');
const mongoose = require('mongoose')
const TMDB = require('../utils/TicketMasterApiDB')

const API_KEY = process.env.TicketMasterAPI_KEY

const DEF_DELAY = 2000;
const SHORT_DELAY = 1640;

// 0.1 lng/lat = 10km
// 1 lng/lat = 1000000 meters

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
    let resLng = lng + x / 100
    let resLat = lat + y / 100
    return {resLng, resLat}
}

let searchParamsDict = {
  "getPoint": "38.9072,-77.0369",
  "radius": "2500",
  "apikey": API_KEY,
}

let eventIdSet = new Set()
let cnt = 0


async function clearTable() {
    await TMDB.deleteMany({}).then(function(){
        console.log("Data deleted");
    }).catch(function(e){
        console.log(e);
    })
}

async function InsertTicketMasterAPIData(params, typeList){
  try {
    let url = new URL(process.env.TicketMasterAPI_Events);
    // Ticket Master api can result up retrieveJsonto 60 results in total, 20 per page
    // console.log(url)
    // DC location

    for(let j = 0; j < typeList.length; j++){
      let tmpDict = Object.assign({}, params);
      tmpDict['classificationName'] = typeList[j];
      url.search = new URLSearchParams(tmpDict);
      let data = await getJSON(url.href);
      console.log(url.href);
      if(data._embedded.events === undefined){
        console.log(url.href);
        continue;
      }
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
        await insertEvent(data._embedded.events[i], maxPrice, minPrice);
      }

      await sleep(SHORT_DELAY);
      let count = 1;

    //   console.log(data.next);
      
      while(data.page !== undefined && data.page.number < 5){
        tmpDict['page'] = count
        tmpDict['size'] = 20
        url.search = new URLSearchParams(tmpDict);
        console.log("--------------------\nCount ", count);
        // console.log(pagetoken);
        // console.log(url.href);
        // console.log(data.results.length);
        data = await getJSON(url.href);
        if(data._embedded === undefined || data._embedded.events === undefined){
            console.log(url.href);
            continue;
        }
        for (let i = 0 ; i < data._embedded.events.length; ++i) {
            let minPrice = undefined
            let maxPrice = undefined
            if (data._embedded.events[i].priceRanges) {
              minPrice = data._embedded.events[i].priceRanges[0].min;
              maxPrice = data._embedded.events[i].priceRanges[0].max
            }
            console.log("***************************");
            console.log(data._embedded.events[i].name);
            await insertEvent(data._embedded.events[i], maxPrice, minPrice);
        }
        count++;
        // console.log(data.next_page_token);
        await sleep(SHORT_DELAY);
      }
      console.log(cnt);
      console.log("index", j);
    }
    console.log("End typelist");
  } catch (err) {
    console.error(err);
  }
}

async function insertEvent(data, maxPriceValue, minPriceValue){
    try{
      console.log('Processing...');
      if(eventIdSet.has(data.id)){
        console.log("Escape for existing", data.id, data.name);
        cnt++;
        return false;
      }
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
      eventIdSet.add(data.id);
      console.log('Insert success');
      // process.exit(0);
    }catch(e){
      console.log('Failed: ' + e);
      // process.exit(1);
    }
  }

var typeList = [];
typeList.push("Sports")
typeList.push("Music")
typeList.push("Comedy")
typeList.push("Festival")
typeList.push("Miscellaneous")
typeList.push("Arts&Theatre")

// init DB by center of lng & lat, radius of the circle = dis * 4
const init = async function _(rad, dis){
    clearTable()
    const lng = 38.9072, lat = -77.0369
    let cnt = 360 / rad
    console.log(cnt)
    for(let i = 0; i < cnt; ++i){
        const res = calculateLngLatByDistance(lng, lat, dis, rad * i);
        console.log(`${res.resLng},${res.resLat}`);
        let params = {
            "geoPoint": `${res.resLng},${res.resLat}`,
            "radius": dis * 2,
            "apikey": API_KEY,
        }
        InsertTicketMasterAPIData(params, typeList);
        // console.log(calculateLngLatByDistance(lng, lat, rad * i, dis));
    }
    rad = rad / 2
    cnt = 360 / rad
    for(let i = 0; i < cnt; ++i){
        const res = calculateLngLatByDistance(lng, lat, dis * 3, rad * i);
        console.log(`${res.resLng},${res.resLat}`);
        let params = {
            "geoPoint": `${res.resLng},${res.resLat}`,
            "radius": dis * 2,
            "apikey": API_KEY,
        }
        InsertTicketMasterAPIData(params, typeList);
        // console.log(calculateLngLatByDistance(lng, lat, rad * i, dis));
    }
    // InsertGoogleMapPlaceAPIData(typeList);
}


function test(rad, dis) {
    const lng = 38.9072, lat = -77.0369
    const cnt = 360 / rad
    console.log(cnt)
    for(let i = 0; i < cnt; ++i){
        console.log(calculateLngLatByDistance(lng, lat, dis, rad * i));
    }
}

// test(45, 5000);


init(45, 5)


// InsertGoogleMapPlaceAPIData();


