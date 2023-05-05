import React from 'react';
import { observer } from 'mobx-react';

import HomeViewModel from '../viewModels/HomeViewModel';

@observer
class HomeView extends React.Component {
  homeModelView = new HomeViewModel();
  render() {
    return (
      <div>
        <h1>Count: {this.homeModelView.getCount()}</h1>
        
        <button onClick={() => this.homeModelView.incrementCount()}>
          Increment Count
        </button>
      </div>
    );
  }
}

export default HomeView;
