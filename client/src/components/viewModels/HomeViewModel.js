import { makeAutoObservable } from 'mobx';
import HomeModel from '../models/HomeModel';

class HomeViewModel {

  constructor() {
    
    this.view = null;
    this.homeModel = new HomeModel();
    makeAutoObservable(this)
  }

  registerView(view) {
    this.view = view;
  }

  unregisterView() {
    this.view = null;
  }

  getCount() {
    return this.homeModel.count;
  }


  incrementCount() {
    this.homeModel.count++;
  }
}

export default HomeViewModel;