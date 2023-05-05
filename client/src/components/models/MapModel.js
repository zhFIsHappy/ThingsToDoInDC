import { makeAutoObservable } from 'mobx';
import store from '../../store/store.js';
const {user,mapSize} =store


class MapModel {
  API="AIzaSyApjxyhZVqst2TuQ3vZ0-i6lKhpnPJuAQg"
  count=0
  containerSize = {
    width: mapSize.width,
    height: mapSize.height
  };
  center = {
    // lat: 39.03361115822926,
    // lng: -77.1079620467089, 
    lat: 38.9072,
    lng: -77.0369, 
  };
  constructor() {
    makeAutoObservable(this)
  }
  markersInfo = []
}



export default MapModel;