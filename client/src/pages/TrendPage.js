import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import axios from 'axios';
// const {user} =store

import '../css/TrendPage.scss';
const { SideBar, SideBarFooter } = SideBarComponents;

class TrendPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      items:["loading"]
    };
    this.getTrend();
    
  }
  // componentDidMount() {

  //   this.createTagInterval = setInterval(() => {
  //     this.createTag();
  //   }, 500);
  // }
  getTrend(){
    axios.post('http://localhost:4000/api/trend/tag', {
    }, 
    // {
    //   headers: {
    //     'Authorization': `Bearer ${user.sessionId}`
    //   }
    // }
    ).then(response => {
      if(response.status==200){
        let tags=[];
        response.data.likeInfo.map(info => tags.push(info.name));
        response.data.viewInfo.map(info => tags.push(info.name));
        this.state.items=tags;
        // this.setState({
        //   itemsLike:tags
        // })
        this.createTagInterval = setInterval(() => {
          this.createTag();
        }, 500);
      }
    }).catch(error => {
      console.log(error.response.data);
      alert(error.response.data.message)
      // window.location.reload();
    });
  }

  componentWillUnmount() {
    clearInterval(this.createTagInterval);
  }

  createTag() {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.textContent = "#" + this.state.items[Math.floor(this.state.items.length*Math.random())];
    tag.style.left = Math.random() * (window.innerWidth - tag.offsetWidth) + "px";
    tag.style.top = Math.random() * (window.innerHeight - tag.offsetHeight) + "px";
    document.body.appendChild(tag);

    setTimeout(() => {
      tag.remove();
    }, 3000);
  }

  render(){
    const { items } = this.state;
    return (
      <div className='trendPage'>
      <SideBar/>
      <div className="trendMain">
        <h1>Trending Now</h1>
        <p>Check out the latest trends!</p>
      </div>
    </div>
      
    );
  }
}

export default TrendPage;