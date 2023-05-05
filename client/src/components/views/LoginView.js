import React from 'react';
import { observer } from 'mobx-react';
import LoginViewModel from '../viewModels/LoginViewModel';

@observer
class Login extends React.Component {
  loginViewModel = new LoginViewModel();

  handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value; //userName
    const password = event.target.password.value; //password
    this.loginViewModel.loginUser(email,password); 
  };

  render() {
    return (
      <div className='login'>
      <h1>Login</h1>
      <form onSubmit={this.handleSubmit}>
        <div id='email'>
          <label htmlFor="email">Email</label>
          <br/>
          <input type="text" id="email" name="email" required />
        </div>
        <div id='password'>
          <label htmlFor="password">Password</label>
          <br/>
          <input type="password" id="password" name="password" required />
        </div>
        <br/>
        <button type="submit">Submit</button>
      </form>
    </div>
    );
  }


   
}

export default Login;