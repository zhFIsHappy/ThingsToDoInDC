import { makeAutoObservable } from 'mobx';
import MapModel from '../models/MapModel';
import { google,mapOptions,Map} from '@react-google-maps/api';
import axios from 'axios';

class MapViewModel {

    constructor() {
      this.MapModel = new MapModel();
      makeAutoObservable(this)
    }
    getCenter() {
      return this.MapModel.center;
    }
    setCenter(center) {
      this.MapModel.center=center;
    }
    getSize() {
      return this.MapModel.containerSize;
    }
    setSize(size){
      this.MapModel.containerSize=size;
    }
    getAPI(){
      return this.MapModel.API;
    }
    
    reSize(){

    }

    getCount() {
      return this.MapModel.count;
    }
  
    incrementCount() {
      this.MapModel.count++;
    }

    getMarkersInfo(){
      console.log("vm info", this.MapModel.markersInfo)
      return this.MapModel.markersInfo
    }
    
    async fetchAllPlaces() {
      await axios.get('http://localhost:4000/api/places/all')
        .then((response) => {
          this.MapModel.markersInfo = []
          const res = response.data
          for(let i = 0; i < res.length && i < 10; ++i){
            this.MapModel.markersInfo.push({
              'lng': res[i].location.longitude.$numberDecimal,
              'lat': res[i].location.latitude.$numberDecimal,
              'id': res[i].mandatory.place_id
            })
          }
          console.log("fetch", this.MapModel.markersInfo)
        }).catch((err) => {
          console.log(err)
        })
    }

    fetchPlacesByTypes() {

    }

}

  
export default MapViewModel;