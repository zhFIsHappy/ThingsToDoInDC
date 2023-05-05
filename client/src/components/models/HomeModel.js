import { makeAutoObservable } from 'mobx';

class HomeModel {
  count=0
  constructor() {
    makeAutoObservable(this)
  }
}

export default HomeModel;