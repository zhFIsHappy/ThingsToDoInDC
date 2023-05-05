import { makeAutoObservable } from 'mobx';

class SideBarModel {
  animationDuration = 300;
  isOpen=true;
  sideBarColorDark="#303133"
  mainColorDark="#F2F6FC"
  sideBarColorLight="#67C23A"
  mainColorLight="#FFFFFF"
  isDarkTheme=true;
  menuTitles=[];
  constructor() {
    makeAutoObservable(this)
  }
}

export default SideBarModel;