import React from 'react';
import SideBarComponents from '../components/views/SideBar';
import '../css/ViewPage.scss';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import store from '../store/store.js';
import { Radar } from 'react-chartjs-2';
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

const { SideBar, SideBarFooter,SideBarFooterDark } = SideBarComponents;

class ViewPage extends React.Component{

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
        response.data.viewInfo.map(info => {
          tags.push(info.name)
          scores.push(info.tourists+info.users)
        });
        // response.data.likeInfo.map(info => tags.push(info.name));
       
        this.setState({
          data:{
            labels: tags,
            datasets: [
              {
                label: '# of Views',
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
      <div className='viewPage'>
      <SideBar/>
        <div className='viewMain'>
        <Radar
            className='radar'
            data={data}
            options={{
              scales: {
                r: {
                  angleLines: {
                    color: 'white'
                  },
                  gridLines: {
                    color: 'white'
                  }
                },
              },
            }}
          />
          <SideBarFooter/>
        </div>
      </div>
    );
  }
}

export default ViewPage;
