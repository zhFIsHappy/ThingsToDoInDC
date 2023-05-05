import { observer, inject } from 'mobx-react';
import React from 'react';

const Home = inject('store')(observer(props => {
  return <React.Fragment>{props.store.userName}<div>
  <h4>Welcome!</h4></div>
  </React.Fragment>
  
}));

// import React from 'react';
// class Home extends React.Component {
//   render() {return (
//     <React.Fragment>
//     </React.Fragment>
// )
// }
// }

export default Home 