import React,{useState} from 'react';
import SideBarComponents from '../components/views/SideBar';
import '../css/HomePage.scss';
const { SideBar, SideBarFooter } = SideBarComponents;


class HomePage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      displayFirst: (Math.random() >= 0.5),
    };
  }
  render(){
    const { displayFirst } = this.state;
    return (
      <div className='homePage'>
          <SideBar /> 
          <div className='homeMain'>
            <div className='titleContainer'>
              <h2 className='title'>Welcome to Funny Spots</h2>
              <h2 className='title'>Use sideBar to start exploring</h2>
              {displayFirst&&<div>
              <p>　　　　　   ／＞　　フ</p>
              <p>　　　　　 |  　_　 _ l</p>
              <p>　 　　　／` ミ＿xノ</p>
              <p>　　 　 /　　　 　 |</p>
              <p>　　　 /　 ヽ　　 ﾉ</p>
              <p>　 　 │　　|　|　|</p>
              <p>　／￣|　　 |　|　|</p>
              <p>　| (￣ヽ＿_ヽ_)__)</p>
              <p>　＼二つ</p>
              </div>}
              {!displayFirst&&<div style={{lineHeight:'0.6'}}>
              <br/><br/><br/>
              <p>⠄⠄⠄⠄⢠⣿⣿⣿⣿⣿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣯⢻⣿⣿⣿⣿⣆⠄⠄⠄</p>
              <p>⠄⠄⣼⢀⣿⣿⣿⣿⣏⡏⠄⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢻⣿⣿⣿⣿⡆⠄⠄</p>
              <p>⠄⠄⡟⣼⣿⣿⣿⣿⣿⠄⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⣿⣇⢻⣿⣿⣿⣿⠄⠄</p>
              <p>⠄⢰⠃⣿⣿⠿⣿⣿⣿⠄⠄⠄⠄⠄⠄⠙⠿⣿⣿⣿⣿⣿⠄⢿⣿⣿⣿⡄⠄</p>
              <p>⠄⢸⢠⣿⣿⣧⡙⣿⣿⡆⠄⠄⠄⠄⠄⠄⠄⠈⠛⢿⣿⣿⡇⠸⣿⡿⣸⡇⠄</p>
              <p>⠄⠈⡆⣿⣿⣿⣿⣦⡙⠳⠄⠄⠄⠄⠄⠄⢀⣠⣤⣀⣈⠙⠃⠄⠿⢇⣿⡇⠄</p>
              <p>⠄⠄⡇⢿⣿⣿⣿⣿⡇⠄⠄⠄⠄⠄⣠⣶⣿⣿⣿⣿⣿⣿⣷⣆⡀⣼⣿⡇⠄</p>
              <p>⠄⠄⢹⡘⣿⣿⣿⢿⣷⡀⠄⢀⣴⣾⣟⠉⠉⠉⠉⣽⣿⣿⣿⣿⠇⢹⣿⠃⠄</p>
              <p>⠄⠄⠄⢷⡘⢿⣿⣎⢻⣷⠰⣿⣿⣿⣿⣦⣀⣀⣴⣿⣿⣿⠟⢫⡾⢸⡟⠄.</p>
              <p>⠄⠄⠄⠄⠻⣦⡙⠿⣧⠙⢷⠙⠻⠿⢿⡿⠿⠿⠛⠋⠉⠄⠂⠘⠁⠞⠄⠄⠄</p>
              <p>⠄⠄⠄⠄⠄⠈⠙⠑⣠⣤⣴⡖⠄⠿⣋⣉⣉⡁⠄⢾⣦⠄⠄⠄⠄⠄⠄⠄⠄</p>
              <br/><br/><br/><br/><br/><br/>
              </div>}
            </div>
            <SideBarFooter/>
          </div>
        </div>
    );
  }
}

export default HomePage;
