import React, { useEffect } from 'react';
import { GoogleMap, LoadScript,useLoadScript,MarkerF,useJsApiLoader,DirectionsRenderer,Autocomplete,InfoWindowF, InfoBoxF } from '@react-google-maps/api';
import { useRef, useState,useReducer} from 'react'
import MapViewModel from '../viewModels/MapViewModel.js';
import '../../css/MapView.scss'
import {Slider,RangeSlider,DoubleSlider} from "./SliderView.js";
import {Dropdown,DropdownAuto} from "./DropdownView.js";
import axios from 'axios';
import store from '../../store/store.js';
const {user,settings} =store


const mapViewModel= new MapViewModel;
const containerStyle = {
  width: mapViewModel.getSize().width,
  height: mapViewModel.getSize().height
};

const center = {
  lat: mapViewModel.getCenter().lat,
  lng: mapViewModel.getCenter().lng
};

const initalMaker={
  "lng": -77.0217983,
  "lat": 38.8955429,
  "kind": "User Location",
}

const MapView= ({ makersLocation }) => {
  

  const [sliderValue, setValue] = useState(50);


  
  // const [range, setRange] = useState({ min: 0, max: 100 })

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);


  const [selectedMarker, setSelectedMarker] = useState(initalMaker);
  const [makerInfo, setmakerInfo] = useState([])

  const [markerAnimations, setMarkerAnimations] = useState([]);

  useEffect(() => {
    setMarkerAnimations(prevState => [...prevState, false]);
  }, []);
  
  const handleMarkerMouseOver = (marker) => {
    setMarkerAnimations(prevState => {
      const newAnimations = [...prevState];
      newAnimations[marker.id] = true;
      return newAnimations;
    });
  };

  const handleSlider = (value) => {
    setValue(value);
    fetchData(`places/rating/rating=${value}&desc=1`)

  };

  const handleSliderChange = (minDate, maxDate) => {
    var flag=false;
    if(minDate!=minValue||maxDate!=maxValue)
      flag=true;
    setMinValue(minDate);
    setMaxValue(maxDate);
    
    if(flag==true){
      console.log('change')
      fetchData(`events/date/startDate/${minDate}/endDate/${maxDate}`)
    }
  };



  const eventOptions = ["Sports", "Music", "Comedy", "Festival","Miscellaneous","Arts&Theatre"];
  

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapViewModel.getAPI(),
    libraries: ['places'],
  })

  
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  // const [directionsResponse, setDirectionsResponse] = useState(null)
  // const [distance, setDistance] = useState('')
  // const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()
  if (!isLoaded) {
    return <div>Failed to load.</div>
  }

  const createMarker = ({lat, lng}) => {
    return <MarkerF position={{ lat, lng }} />;
  };

  

  // function renderMarkers() {
  //   return makersLocation.map((element) => (
  //     <MarkerF
  //       key={element.id}
  //       position={{ lat: element.lat, lng: element.lng }}
  //     />
  //   ));
  // }


  const locations = [
  { id: 1, lat: 38.9072, lng: -77.0369, name: 'Location A', rating: 4.2, type:'zoo',vicinity:''},
  { id: 2, lat: 38.8977, lng: -77.0365, name: 'Location B', rating: 3.7, type:'park', vicinity:''},
  { id: 3, lat: 38.8979, lng: -77.0366, name: 'Location C', rating: 2.1, type:'museum',vicinity:''},
  ];



  async function fetchData(option) {
    await axios.get('http://localhost:4000/api/'+option)
    .then((response) => {
      let info = []
      const res = response.data
      console.log(res)
      for(let i = 0; i < res.length; ++i){
        if (res[i].mandatory.place_id !== undefined) {
          info.push({
            'markerType': 'place',
            'lng': Number(res[i].location.longitude.$numberDecimal),
            'lat': Number(res[i].location.latitude.$numberDecimal),
            'type': res[i].mandatory.types[0],
            'id': res[i].mandatory.place_id,
            'vicinity': res[i].location.vicinity,
            'name': res[i].mandatory.name,
            'rating': Number(res[i].mandatory.rating),
            'typeAlt': res[i].mandatory.types[1]
          })
        } else {
          info.push({
            'markerType': 'event',
            'lng': Number(res[i].location.longitude.$numberDecimal),
            'lat': Number(res[i].location.latitude.$numberDecimal),
            'type': res[i].mandatory.types[0],
            'id': res[i].mandatory.event_id,
            'vicinity': res[i].location.vicinity,
            'name': res[i].mandatory.name,
            'rating': Number(res[i].mandatory.rating),
            'typeAlt': res[i].mandatory.types[1],
            'start_date':res[i].mandatory.start_date,
            'imgUrl' : res[i].optional.img_url,
            'holdPlaceName' : res[i].location.name,
            'minPrice': res[i].optional.minTicketPrice? res[i].optional.minTicketPrice : 0,
            'maxPrice':  res[i].optional.maxTicketPrice? res[i].optional.maxTicketPrice : 1000,
            'buyTicketURL' : res[i].optional.url  
          })
        }
      }
      console.log("fetch", info)
      setmakerInfo(info);
    }).catch((err) => {
      console.log(err)
    })
    // setmakerInfo(info);
  }


  function addView(kindValue,idValue,nameValue,locationValue) {
    setSelectedMarker(null);
    if(user.sessionId)
      axios.post('http://localhost:4000/api/user/views', {
        kind:kindValue,
        id:idValue,
        name:nameValue,
        location:locationValue
      }, {
        headers: {
          'Authorization': `Bearer ${user.sessionId}`
        }
      }).then(response => {
        //nothing
      }).catch(error => {
        console.log(error.response.data);
        alert(error.response.data.message)
      });
  }

  function addFav(kindValue,idValue,nameValue,locationValue) {
    if(user.sessionId)
      axios.post('http://localhost:4000/api/user/likes', {
        kind:kindValue,
        id:idValue,
        name:nameValue,
        location:locationValue
      }, {
        headers: {
          'Authorization': `Bearer ${user.sessionId}`
        }
      }).then(response => {
        alert(response.data.message)
      }).catch(error => {
        console.log(error.response.data);
        alert(error.response.data.message)
      });
  }
  

  const handleDropdownChangeEvent = (option) => {
    console.log(`Dropdown option selected: ${option}`);
    fetchData(`events/type/${option}`)
  };

  const handleDropdownChangePlace = (option) => {
    console.log(`Dropdown option selected: ${option}`);
    fetchData(`places/type/${option}`)

  };

  function refreshMapView(){
    if(mapViewModel.getCount() < 1){
      mapViewModel.incrementCount()
      fetchData('places/all')
    }
  }

  refreshMapView()

  function renderMarkers() {
    return makerInfo.map((data) => {
      let iconUrl = '';
      if (data.markerType === 'place') {
        data['class'] = 'place'
        iconUrl = require('../../asserts/places-marker.png');
      }else{
        data['class'] = 'event'
        iconUrl = require('../../asserts/event-marker.png');
      }
      return (
        <MarkerF
          key={data.id}
          position={{ lat: data.lat, lng: data.lng }}
          onMouseOver={() => handleMarkerMouseOver(data)}
          animation={
            markerAnimations[data.id]? window.google.maps.Animation.DROP: null
          }
          visible={true}
          icon={{
            url: iconUrl,
          }}
          onClick={() => {
            setSelectedMarker(data)
          }}
        />
      );
    });
  }

  
  // fetchData()
  // 
  // aa(mapViewModel.getMarkersInfo())
  // info = mapViewModel.getMarkersInfo()

  // console.log("react info", info)

  // const markers = info.map(location => (
  //   <MarkerF
  //     key={location.id}
  //     position={{ lat: location.lat, lng: location.lng }}
  //     icon={{
  //              url: (require('../../asserts/places-marker.png')),
  //         }}
  //     visible= {true}
  //     onClick={() => setSelectedMarker(location)}
  //   />
  // ));
  
const markers = locations.map(location => (
  <MarkerF
    key={location.id}
    position={{ lat: location.lat, lng: location.lng }}
    icon={{
      url: (require('../../asserts/places-marker.png')),
    }}
    visible= {true}
    onClick={() => setSelectedMarker(location)}
  />
));

  return (
    <div style={{width: '100%', height: '100vh',display: 'flex'}}>
      <div style={{width: '15%', height: '100vh',color:'white'}}>
        <h1>Search</h1>
        {/* <Slider value={sliderValue} onChange={handleSlider} /> */}
        {settings.search&&('both'==settings.search||'googleApi'==settings.search)&& <div>
        <h3>Rating Range</h3>
        <Slider min={0}max={5}step = {0.5} onChange={handleSlider}/>
        </div>}
        {settings.search&&('both'==settings.search||'googleApi'==settings.search)&& <div>
        <h3>Place Type</h3>
        <DropdownAuto  title={"Place Type"} onChange={handleDropdownChangePlace}/>
        </div>}
        {settings.search&&('both'==settings.search||'outerSource'==settings.search)&& <div>
        <h3>Event Type</h3>
        <Dropdown options={eventOptions} title={"Event Type"} onChange={handleDropdownChangeEvent} />
        </div>}
        {settings.search&&('both'==settings.search||'outerSource'==settings.search)&& <div>
        <h3>Date Range</h3>
        <DoubleSlider min={0} max={30} step = {1} onChange={handleSliderChange}/>
        <h5>Start : {minValue} Days Later</h5>
        <h5>End : {maxValue} Days Later</h5>
        </div>}
        {/* <button onClick={()=>createMarker(center)}></button> */}
      </div>
      <div style={{width: '2%', height: '100vh'}}/>
      <div style={{width: '82%', height: '100vh'}}>
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          tilt:40,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
        onLoad={map => setMap(map)}
      >

        {/* {markers} */}
        {renderMarkers()}
        {selectedMarker && selectedMarker.kind!="User Location" && (
        <InfoWindowF
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={() => addView(selectedMarker.class,selectedMarker.id,selectedMarker.name,selectedMarker.vicinity)}
        >
          <div className="info-window">
            {selectedMarker.class === 'event' && 
              <div className="info-window" >
                <div className='info-window-event-basic'>
                  <img className='info-window-event-img' src={selectedMarker.imgUrl} width='45%'/>
                  <div className='info-window-event-geo'>
                    <div className='info-attribute'>
                      <a className="info-attribute-name">Name:</a> {selectedMarker.name}
                    </div>
                    <div className='info-attribute'>
                      <a className="info-attribute-name">Vicinity:</a> {selectedMarker.vicinity}
                    </div>
                    <div className='info-attribute'>
                      <a className="info-attribute-name">Location Name:</a> {selectedMarker.holdPlaceName}
                    </div>
                    <div className='info-attribute'>
                      <a className='info-attribute-name'>Type 1:</a> {selectedMarker.type} 
                    </div>
                    <div className='info-attribute'>
                      <a className='info-attribute-name'>Type 2:</a> {selectedMarker.typeAlt}
                    </div>
                  </div>
                </div>
                <div className='info-window-event-extra'>
                  <div className='info-window-event-ticket'>
                    <div className='info-attribute'>
                      <a className='info-attribute-name'>Start Date:</a> {selectedMarker.start_date}
                    </div>
                    <div className='info-attribute'>
                      <a className='info-attribute-name'>Buy ticket URL:</a> <a className='info-window-event-ticket-url' href={selectedMarker.buyTicketURL} target="_blank" rel="noopener noreferrer" style={{color: 'green', textDecoration: 'none',transition: 'all 0.3s ease-in-out'}} onMouseEnter={(e) => e.target.style.color = 'grey'}
   onMouseLeave={(e) => e.target.style.color = 'green'}>Click to see details</a>
                    </div>
                    <div className='info-attribute'>
                      <a className='info-attribute-name'>Price range:</a> ${selectedMarker.minPrice} ~ ${selectedMarker.maxPrice}
                    </div>
                  </div>
                  <div className='info-window-event-fav'>
                    <button className='info-window-add-fav' onClick={()=>addFav(selectedMarker.class,selectedMarker.id,selectedMarker.name,selectedMarker.vicinity)}>Add favorite</button>
                  </div>
                </div>

                
              </div>
            }
            {selectedMarker.class === 'place' && 
              <div className="info-window" >
                <div className='info-attribute'>
                  <a className="info-attribute-name">Name:</a> {selectedMarker.name}
                </div>
                <div className='info-attribute'>
                  <a className="info-attribute-name">Vicinity:</a> {selectedMarker.vicinity}
                </div>
                <div className='info-attribute'>
                  <a className="info-attribute-name">Rating:</a> { selectedMarker.rating }
                </div>
                <div className='info-attribute'>
                  <a className='info-attribute-name'>Type 1:</a> {selectedMarker.type} 
                </div>
                <div className='info-attribute'>
                  <a className='info-attribute-name'>Type 2:</a> {selectedMarker.typeAlt}
                </div>
                <button className='info-window-add-fav' onClick={()=>addFav(selectedMarker.class,selectedMarker.id,selectedMarker.name,selectedMarker.vicinity)}>Add favorite</button>
              </div>
            }
            {/* { selectedMarker.class === 'event' && 
              <div className='info-attribute'>
                <a className='info-attribute-name'>Start Date:</a> {selectedMarker.start_date}
              </div>
            }
            
            { selectedMarker.class === 'event' && 
              <div className='info-attribute'>
                <a className='info-attribute-name'>Buy ticket URL:</a> { selectedMarker.buyTicketURL }
              </div>
            }
            { selectedMarker.class === 'event' &&
              <div className='info-attribute'>
                 <a className='info-attribute-name'>Price range:</a> {selectedMarker.minPrice} - {selectedMarker.maxPrice}
              </div>
            } */}
            
          </div>
          </InfoWindowF>
        )}
      </GoogleMap>
      </div>
    </div>
  )
  // return (
  //   <LoadScript
  //     googleMapsApiKey={mapViewModel.getAPI()}
  // >
  //     <GoogleMap
  //       mapContainerStyle={containerStyle}
  //       center={center}
  //       zoom={10}
  //     >
  //       { /* Child components, such as markers, info windows, etc. */ }
  //       <></>
  //       <Marker position={center}></Marker>
  //     </GoogleMap>
  //   </LoadScript>
  // )
}

export default MapView;