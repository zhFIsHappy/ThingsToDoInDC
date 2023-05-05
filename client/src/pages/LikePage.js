import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import '../css/LikePage.scss';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import store from '../store/store.js';
import axios from 'axios';
const {user} =store

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const { SideBar, SideBarFooterDark } = SideBarComponents;

class LikePage extends React.Component{

  constructor(props) {
    super(props);
    
    this.state = {
      data : {
        labels: ['Trend 1', 'Trend 2', 'Trend 3', 'Trend 4', 'Trend 5', 'Trend 6'],
        datasets: [
          {
            label: '# of Views',
            data: [10, 9, 8, 9, 7, 9],
            backgroundColor: 'rgba(5, 205, 255,0.5)',
            borderColor: 'rgba(5, 205, 255,1)',
            borderWidth: 1,
          },
        ],
      }
    }
    this.getTrend();
  }

  getTrend(){
    axios.post('http://localhost:4000/api/trend/tag', {
    }, 

    ).then(response => {
      if(response.status==200){
        let tags=[];
        let scores=[];
        response.data.likeInfo.map(info => {
          tags.push(info.name)
          scores.push(info.tourists+info.users)
        });
       
        this.setState({
          data:{
            labels: tags,
            datasets: [
              {
                label: '# of Likes',
                data: scores,
                backgroundColor: 'rgba(5, 205, 255,0.5)',
                borderColor: 'rgba(255, 255, 255,1)',
                borderWidth: 1,
              },
            ],
          }
        })
      }
    }).catch(error => {
      console.log(error.response.data);
      alert(error.response.data.message)
      // window.location.reload();
    });
  }

  render(){
    const { data } = this.state;
    return (
      <div className='likePage'>
      <SideBar/>
        <div className='likeMain'>
          <Radar className='radar' data={data} />
          <SideBarFooterDark/>
        </div>
      </div>
    );
  }
}

export default LikePage;
