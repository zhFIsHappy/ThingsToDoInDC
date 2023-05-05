import logo from './asserts/logo.svg';
import './App.scss';
import RouterView from './router/index'
import {NavLink} from 'react-router-dom'
import { Component } from 'react';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


class App extends Component{
  render(){
    return (
      <div className="App">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div className="container">
          <RouterView>
          </RouterView>
        </div>
        {/* <NavLink to="/">HomePage</NavLink>
        <NavLink to="/search">Map</NavLink>
        <NavLink to="/user">UserCenter</NavLink> */}
      </div>
    );
  }
}

export default App;
