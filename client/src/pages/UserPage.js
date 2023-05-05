import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import apiRes from '../utils/apiRes.js';

const { SideBar, SideBarFooter } = SideBarComponents;

class UserPage extends React.Component{

  componentDidMount() {
    apiRes.get('/places/all')
      .then(response  => {
        console.log(response );
        // handle the response data here
      })
      .catch(error => {
        console.error(error);
        // handle the error here
      });
  }

  render(){
    return (
      <SideBar/>
    );
  }
}

export default UserPage;
