import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import Map from '../components/views/MapView';
import DoubleSlider from '../components/views/SliderView';
import '../css/SearchPage.scss';
import store from '../store/store.js';

const {stores,mapSize} =store

mapSize.height=window.innerheight/3*2;
mapSize.width=window.innerWidth/3*2;


const { SideBar, SideBarFooter } = SideBarComponents;
class SearchPage extends React.Component{
  render(){
    return (
        <div className='searchPage'>
          <SideBar /> 
          <div style={{width:'2%', backgroundColor: '#333333'}}></div>
          <div className='mapMain'>
            <Map/>
            <SideBarFooter/>
          </div>
        </div>
    );
  }
}

export default SearchPage;
