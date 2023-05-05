import { makeAutoObservable } from 'mobx';
import RegisterModel from '../models/RegisterModel';
import axios from 'axios';

class RegisterViewModel {

  constructor() {
    
    this.view = null;
    this.registerModel = new RegisterModel();
    makeAutoObservable(this)
  }

  registerView(view) {
    this.view = view;
  }

  unregisterView() {
    this.view = null;
  }

  getCount() {
    return this.registerModel.count;
  }


  incrementCount() {
    this.registerModel.count++;
  }
  addUser(username,email,password) {

    axios.post('http://localhost:4000/api/user/register', {
      name: username,
      email: email,
      password: password,
      })
      .then((response) => {
        console.log(response);
        alert(response.data.message)
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          alert(error.response.data.message);
        }
    });

  }
}

export default RegisterViewModel;


