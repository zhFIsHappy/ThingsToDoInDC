import React from 'react';
import { observer } from 'mobx-react';
import SideBarViewModel from '../viewModels/SideBarViewModel';
import { NavLink } from "react-router-dom";
import logo from '../../asserts/logo.svg';
import homeIcon from '../../asserts/homeIcon.png';
import mapIcon from '../../asserts/mapIcon.png';
import userIcon from '../../asserts/userIcon.png';
import '../../App.scss';
import '../../css/SideBar.scss';


@observer
class SideBar extends React.Component {
    sideBarViewModel=new SideBarViewModel();
    
    render() {
        return (
            <div className="sideBarComponent" style={{display: 'flex'}}>
                <aside className="sidebar">
                    <a className="collapse" onClick={() => this.sideBarViewModel.toggle()}>
                        {/* <i class="ri-arrow-left-s-line"/> */}
                        ^
                    </a>
                    <div className="imageWrapper">
                        <img src={logo} className="logo" alt="logo" style={{translate: '50px,50px'} } />
                    </div>
                    <div className='sideBarLayout'>
                        <div className="sideBarHeader">
                            <div className='logoSimple'>FS</div>
                            <h5>Funny Spots</h5>
                        </div>
                        <div className="sideBarBody">
                            <nav className="menu">
                                <ul>
                                    <li className='menuTitle' onClick={(event)=>this.sideBarViewModel.collapseMenuList(event)}><span>Menu</span></li>
                                    <li className='menuList' id='Menu'>
                                        <a onClick={(event)=>this.sideBarViewModel.collapseMenuSubList(event)}>
                                        
                                            <span className="menuIcon">
                                                <img className="homeIcon" src={homeIcon}></img>
                                            </span>
                                            <span className="menuName">Piazza</span>
                                            <span className="menuSuffix">
                                                <span className="suffix">New!</span>
                                            </span>
                                        
                                        </a>
                                        <div className="subMenuList" id='Piazza'>
                                            <ul>
                                                <li className="menuItem">
                                                    <NavLink to="/trend" >
                                                    <span className="menuName">Trending</span>
                                                    </NavLink>
                                                </li>
                                                <li className='menuList'>
                                                    <a onClick={(event)=>this.sideBarViewModel.collapseMenuSubList(event)}>
                                                        <span className="menuName" >Popularity</span>
                                                    </a>
                                                    <div className="subMenuList" id="Popularity">
                                                        <ul>
                                                            <li className="menuItem">
                                                                <NavLink to="/view" >
                                                                    <span className="menu-prefix">&#127881;</span>
                                                                    <span className="menu-title">Most Views</span>
                                                                </NavLink> 
                                                            </li>
                                                            <li className="menuItem">
                                                                <NavLink to="/like" >
                                                                    <span className="menu-prefix">&#127881;</span>
                                                                    <span className="menu-title">Most Likes</span>
                                                                </NavLink> 
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <a onClick={(event)=>this.sideBarViewModel.collapseMenuSubList(event)}>
                                        
                                            <span className="menuIcon">
                                                <img className="mapIcon" src={mapIcon}></img>
                                            </span>
                                            <span className="menuName">Map</span>
                                            <span className="menuSuffix">
                                                <span className="suffix">New!</span>
                                            </span>
                                        
                                        </a>
                                        <div className="subMenuList" id='Map'>
                                            <ul>
                                                <li className="menuItem">
                                                    <NavLink to="/search" >
                                                    <span className="menuName">Search</span>
                                                    </NavLink>
                                                </li>
                                                <li className='menuList'>
                                                    <NavLink to="/upload" >
                                                        <span className="menuName">Upload</span>
                                                    </NavLink>
                                                    <div className="subMenuList">
                                                        <ul>
                                                            <li className="menuItem">
                                                                <a href="#/sideBar">
                                                                    <span className="menu-prefix">&#127881;</span>
                                                                    <span className="menu-title">Upload!!!</span>
                                                                </a>  
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        

                                    </li>

                                    <li className='menuTitle'  onClick={(event)=>this.sideBarViewModel.collapseMenuList(event)}><span>User</span></li>
                                    <li className='menuList' id='User'>
                                        <a onClick={(event)=>this.sideBarViewModel.collapseMenuSubList(event)}>
                                            <span className="menuIcon">
                                                <img className="userIcon" src={userIcon}></img>
                                            </span>
                                            <span className="menuName">Center</span>
                                            <span className="menuSuffix">
                                                <span className="suffix">New!</span>
                                            </span>
                                        </a>
                                        <div className="subMenuList" id='Center'>
                                            <ul>
                                                <li className="menuItem">
                                                    <NavLink to="/overview" >
                                                        <span className="menu-prefix">&#127881;</span>
                                                        <span className="menu-title">OverView</span>
                                                    </NavLink>  
                                                </li>
                                                <li className="menuItem">
                                                    <NavLink to="/setting" >
                                                        <span className="menu-prefix">&#127881;</span>
                                                        <span className="menu-title">Settings</span>
                                                    </NavLink>  
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="sideBarFooter">
                            <div className="reference">
                                <img src={logo} className="logo" alt="logo" />
                            </div>
                            <div className="footerContent" style={{padding: "0 10px"}}>
                                <span style={{display: "block", marginBottom: "10px",color:'#6fed31'}}
                                >Intertwine your life <br/>with everyday fun 
                                </span>
                                <div style={{marginBottom: "15px"}}>
                                <img
                                    alt="preview badge"
                                    src="https://img.shields.io/github/stars/zhFIsHappy/CS5614-DBMS-Funny-Spots-to-go-Google-Map-API-?style=social"
                                />
                                </div>
                                <div>
                                <a href="https://github.com/zhFIsHappy" target="_blank" style={{color:'#6fed31'}}
                                    >Check it out!</a>
                                <br/>
                                <br/>
                                </div>
                            </div>

                        </div>
                    </div>
                </aside>

                {/* <div id="canvasMain" className="canvasMain">
                    <div className="canvasLayout">
                        <main className="content">
                            <div>
                                <a id="toggle" href="#/sideBar" className="sidebar-toggler break-point-sm">
                                    <i className="ri-menu-line ri-xl"></i>
                                </a>
                                <h1 style={{marginBottom: '0'}}>Content</h1>
                            </div>
                            <span style={{display: 'inline-block'}}>
                            Content
                            </span>
                            <br />
                            <span>
                                Content
                            </span>
                            <div>
                                <h2>Features</h2>
                                <ul>
                                    <li>Content</li>
                                    <li>Content</li>
                                    <li>Content</li>
                                    <li>Content</li>
                                    <li>Content</li>
                                </ul>
                            </div>
                        </main>
                        
                    </div>
                </div> */}
            </div>
        );
    }
}


@observer
class SideBarFooter extends React.Component {
    sideBarViewModel=new SideBarViewModel();
    
    render() {
        return (
            <footer className="footer">
                <small style={{marginBottom: '20px', display: 'inline-block', color:'white'}}>
                    © 2023 made with
                    <span style={{color: 'red', fontSize: '18px'}}>&#10084;</span> by -
                    <a target="_blank" href="https://github.com/zhFIsHappy" style={{color:'white'}}> Frank </a>
                </small>
            </footer>
        )
    }
}

@observer
class SideBarFooterDark extends React.Component {
    sideBarViewModel=new SideBarViewModel();
    
    render() {
        return (
            <footer className="footer">
                <small style={{marginBottom: '20px', display: 'inline-block', color:'black'}}>
                    © 2023 made with
                    <span style={{color: 'red', fontSize: '18px'}}>&#10084;</span> by -
                    <a target="_blank" href="https://github.com/zhFIsHappy" style={{color:'black'}}> Frank </a>
                </small>
            </footer>
        )
    }
}


export default {SideBar,SideBarFooter,SideBarFooterDark};