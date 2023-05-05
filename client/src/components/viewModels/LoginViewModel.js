import { makeAutoObservable } from 'mobx';
import LoginModel from '../models/LoginModel';
import axios from 'axios';
import store from '../../store/store.js';
const {user} =store
class LoginViewModel {

  constructor() {
    this.loginModel = new LoginModel();
    makeAutoObservable(this)
  }


  loginUser(email,password) {
    user.setPassword(password)
    user.setEmail(email);
    axios.post('http://localhost:4000/api/user/login', {
    email: email,
    password:password
  })
  .then((response) => {
    if(response.status === 200) {
      user.setSessionId(response.data.token);
      user.setName(response.data.name);
      alert(response.data.message)
      window.location.reload();
    }
    else{
      user.setSessionId('NotLogin');
      user.setName('NotLogin');
      user.setEmail('NotLogin');
      user.setPassword('NotLogin');
      alert(response.data.message)
    }
    // console.log(response);
  })
  .catch((error) => {
    user.setSessionId('NotLogin');
    user.setName('NotLogin');
    user.setEmail('NotLogin');
    user.setPassword('NotLogin');
    alert(error.response.data.message)
    console.error(error.response.data.message);
  });
  }
  

}

export default LoginViewModel;


