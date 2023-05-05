import { makeAutoObservable } from 'mobx';

class LoginModel {
  count=0
  constructor() {
    makeAutoObservable(this)
  }
}

export default LoginModel;