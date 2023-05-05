import { makeAutoObservable } from 'mobx';

class RegisterModel {
  count=0
  constructor() {
    makeAutoObservable(this)
  }
}

export default RegisterModel;