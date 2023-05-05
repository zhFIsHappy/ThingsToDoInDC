import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import Map from '../components/views/MapView';
import '../css/UploadPage.scss';
import store from '../store/store.js';

const {stores,mapSize} =store

mapSize.height=window.innerheight/3*2;
mapSize.width=window.innerWidth/3*2;


const { SideBar, SideBarFooter } = SideBarComponents;
class UploadPage extends React.Component{
  center = {
    lat: 39.03361115822926,
    lng: -77.1079620467089, 
  };
  render(){
    return (
        <div className='uploadPage'>
          <SideBar /> 
          <div style={{width:'2%', backgroundColor: '#333333'}}></div>
          <div className='uploadMain'>
            <Map makersLocation={this.center}/>
              
            <SideBarFooter/>
          </div>
        </div>
    );
  }
}

export default UploadPage;
