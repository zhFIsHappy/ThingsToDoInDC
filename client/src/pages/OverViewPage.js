import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import CollapsePanel from '../components/views/CollapseView';
import {ListFlip} from '../components/views/ListView';
import '../css/OverViewPage.scss';
import store from '../store/store.js';
import SSO from '../components/views/SSOView';
import InputWindow from '../components/views/inputWindowView';
import axios from 'axios';
const {user} =store


const { SideBar, SideBarFooter } = SideBarComponents;

class OverViewPage extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      showInputWindow: false,
      inputWindowType: '',
      itemsLike: [{name: 'Loading', kind: 'Loading', location: 'Loading' },],
      itemsView:[{ name: 'Loading', kind: 'Loading', location: 'Loading' },],
    };
    if(user.sessionId!='NotLogin'){
      this.getInfo();
      this.getLike();
      this.getView();
    }
  }

  getInfo(){
    axios.post('http://localhost:4000/api/user/info', {
    }, {
      headers: {
        'Authorization': `Bearer ${user.sessionId}`
      }
    }).then(response => {
      // user.setSessionId(response.data.token);
      user.setName(response.data.name);
      user.setEmail(response.data.email);
      user.setPassword("**********");
      document.getElementsByClassName('myUserName')[0].textContent = user.userName;
      document.getElementsByClassName('myUserEmail')[0].textContent = user.userEmail;
      document.getElementsByClassName('myUserPassword')[0].textContent = "**********";
    }).catch(error => {
      console.log(error.response.data);
      alert(error.response.data.message)
      user.setSessionId('NotLogin');
      user.setName('NotLogin');
      user.setEmail('NotLogin');
      user.setPassword('NotLogin');
      window.location.reload();
    });
  }

  getLike(){
    axios.post('http://localhost:4000/api/user/likeInfo', {
    }, {
      headers: {
        'Authorization': `Bearer ${user.sessionId}`
      }
    }).then(response => {
      if(response.status==200)
      this.setState({
        itemsLike:response.data.likedPlaces
      })
    }).catch(error => {
      console.log(error.response.data);
      alert(error.response.data.message)
      window.location.reload();
    });
  }
  getView(){
    axios.post('http://localhost:4000/api/user/ViewInfo', {
    }, {
      headers: {
        'Authorization': `Bearer ${user.sessionId}`
      }
    }).then(response => {
      if(response.status===200)
      this.setState({
        itemsView:response.data.watchedPlaces
      })
    }).catch(error => {
      console.log(error.response.data);
      alert(error.response.data.message)
      window.location.reload();
    });
  }

  handleButtonClick(type) {
    this.setState({
      showInputWindow: true,
      inputWindowType: type,
    });
  }

  handleCloseInputWindow() {
    this.setState({
      showInputWindow: false,
      inputWindowType: '',
    });
    this.getInfo();
  }

  render(){
    const { showInputWindow, inputWindowType,itemsLike,itemsView } = this.state;
    
    return (
      <div className='overViewPage'>
      <SideBar /> 
      <div className='overViewMain'>
        {user.sessionId=='NotLogin' && 
          <SSO/>
        }
        {user.sessionId!=='NotLogin' && <div className='overViewMain'>
        <h1 style={{color:'#29d33a'}}>Overview</h1>
            <br/>
        <CollapsePanel title="&nbsp;&nbsp;&nbsp;&nbsp; About Me">
          <div className="infoContainer">
            <p>Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className='myUserName'>{user.userName}</p>
            <p onClick={() => this.handleButtonClick('name')}>Change Name</p>
          </div>
          <div className="infoContainer">
            <p>E-mail:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className='myUserEmail'>{user.userEmail}</p>
            <p onClick={() => this.handleButtonClick('email')}>Change Email Address</p>
          </div>
          <div className="infoContainer">
            <p>Password:</p>
            <p className='myUserPassword'>{user.userPassword}</p>
            <p onClick={() => this.handleButtonClick('password')}>Change Password</p>
          </div>
        </CollapsePanel>
        <CollapsePanel title="&nbsp;&nbsp;&nbsp;&nbsp; Favorites">
          <ListFlip items={itemsLike}/>
        </CollapsePanel>
        <CollapsePanel title="&nbsp;&nbsp;&nbsp;&nbsp; History">
        <ListFlip items={itemsView}/>
        </CollapsePanel>
        <CollapsePanel title="&nbsp;&nbsp;&nbsp;&nbsp; Statistics">
          <p>Ongoing</p>
        </CollapsePanel>
        </div>
        }
       
        <SideBarFooter/>
      </div>
      {showInputWindow && (
          <InputWindow
            title={`Change ${inputWindowType}`}
            url={`http://localhost:4000/api/user/change/${inputWindowType}`}
            onClose={() => this.handleCloseInputWindow()}
          />
        )}
    </div>

    
    );
  }
}

export default OverViewPage;
