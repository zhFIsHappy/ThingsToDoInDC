import React from 'react';
import { observer } from 'mobx-react';
import RegisterViewModel from '../viewModels/RegisterViewModel';

@observer
class Register extends React.Component {
  registerViewModel = new RegisterViewModel();

  handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value; //userName
    const password = event.target.password.value; //password
    const email = event.target.email.value; //userName
    this.registerViewModel.addUser(username,email,password); 
  };

  render() {
    return (
      <div className='register'>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div id='username'>
            <label htmlFor="username">Username</label>
            <br />
            <input type="text" id="username" name="username" required />
          </div>
          <div id='email'>
            <label htmlFor="email">Email</label>
            <br />
            <input type="text" id="email" name="email" required />
          </div>
          <div id='password'>
            <label htmlFor="password">Password</label>
            <br />
            <input type="password" id="password" name="password" required />
          </div>
          <br />
        <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }


   
}

export default Register;