import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import CollapsePanel from '../components/views/CollapseView';
import '../css/SettingPage.scss';
import store from '../store/store.js';
import SSO from '../components/views/SSOView';
import InputWindow from '../components/views/inputWindowView';
import axios from 'axios';
const {user,settings} =store

const { SideBar, SideBarFooter } = SideBarComponents;

class SettingPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      showInputWindow: false,
      inputWindowType: '',
    };
    if(user.sessionId!='NotLogin')
      this.getInfo()
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
      user.setPassword("**********")
      settings.setStyle(response.data.settings.style)
      settings.setSearch(response.data.settings.search)
      this.componentDidMount()
  
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
  }


  componentDidMount() {
    const searchRadios = document.getElementsByName('search');
    const styleRadios = document.getElementsByName('style');

    for (let i = 0; i < searchRadios.length; i++) {
      if (searchRadios[i].value === settings.search) {
        searchRadios[i].checked = true;
      }
    }

    for (let i = 0; i < styleRadios.length; i++) {
      if (styleRadios[i].value === settings.style) {
        styleRadios[i].checked = true;
      }
    }
  }
  uploadSettings(searchSetting,styleSetting){
    settings.setSearch(searchSetting);
    settings.setStyle(styleSetting);
    axios.post('http://localhost:4000/api/user/settings', {
      search:searchSetting,
      style:styleSetting
  }, {
    headers: {
      'Authorization': `Bearer ${user.sessionId}`
    }
  }).then(response => {
    if(response.status===200)
      this.componentDidMount()
    else
      alert(response.data.message)
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

  render(){
    const { showInputWindow, inputWindowType } = this.state;
    return (
      <div className='settingPage'>
        <SideBar /> 
        <div className='settingMain'>
          {user.sessionId=='NotLogin' && 
            <SSO/>
          }
          {user.sessionId!=='NotLogin' && <div className='settingMain'>
          <h1 style={{color:'#29d33a'}}>Settings</h1>
          <br/>
          <CollapsePanel title="&nbsp;&nbsp;&nbsp;&nbsp; Personal Information Settings">
          <div className="buttonContainer">
            <p onClick={() => this.handleButtonClick('name')}>Change Name</p>
            <p onClick={() => this.handleButtonClick('email')}>Change Email Address</p>
            <p onClick={() => this.handleButtonClick('password')}>Change Password</p>
          </div>
          </CollapsePanel>
          <CollapsePanel title="&nbsp;&nbsp;&nbsp;&nbsp; Search Settings">
          <div className="choiceContainer">
            <label>
              <input type="radio" name="search" value="googleApi" onChange={() => this.uploadSettings('googleApi',settings.style)} />
              Only Google Api
            </label>
            <label>
              <input type="radio" name="search" value="outerSource" onChange={() => this.uploadSettings('outerSource',settings.style)}/>
              Only Outer Source
            </label>
            <label>
              <input type="radio" name="search" value="both" onChange={() => this.uploadSettings('both',settings.style)}/>
              Use Both
            </label>
          </div>
          </CollapsePanel>
          <CollapsePanel title="&nbsp;&nbsp;&nbsp;&nbsp; Style Settings">
            <div className="choiceContainer">
            <label>
              <input type="radio" name="style" value="light"  onChange={() => this.uploadSettings(settings.search,'light')}/>
              Light Mode
            </label>
            <label>
              <input type="radio" name="style" value="night"  onChange={() => this.uploadSettings(settings.search,'night')}/>
              Night Mode
            </label>
            </div>
          </CollapsePanel>
          </div>}
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

export default SettingPage;