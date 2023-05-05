import React from 'react';
import { observer } from 'mobx-react';
import LoginView from './LoginView';
import Register from './RegisterView';
import VerticalSplit from './VerticalSplitView';
import '../../css/SSOView.scss'

@observer
class SSO extends React.Component {

    render() {
        return (
            // <div className='SSO'>
                <VerticalSplit
                leftComponent={<Register/>}
                rightComponent={<LoginView/>}
                />
            // </div>
        )
      }
   
}

export default SSO;