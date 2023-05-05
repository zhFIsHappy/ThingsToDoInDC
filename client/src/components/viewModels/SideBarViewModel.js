import { makeAutoObservable } from 'mobx';
import SideBarModel from '../models/SideBarModel';

class SideBarViewModel {
  constructor() {
    this.sideBarModel = new SideBarModel();
    makeAutoObservable(this);
  }

  toggle() {
    this.toggleMenuTitle();
    this.toggleMenuList();
    
    document.querySelector('.sidebar').classList.toggle('sidebarCollapse');
    document.querySelector('.collapse').classList.toggle('collapsing');
    document.querySelector('.sideBarHeader').classList.toggle('sideBarHeaderCollapse');
    document.querySelector('.sideBarFooter').classList.toggle('footerCollapse');
    document.querySelectorAll('.menuTitle').forEach((menuTitle)=>menuTitle.classList.toggle('menuTitleCollapse'));
    // document.querySelectorAll('.menuList').forEach((menuList)=>menuList.classList.toggle('menuListCollapseDisappear'));
    // document.querySelectorAll('.menuList').forEach((menuList)=>menuList.classList.toggle('menuListCollapseAppear'));

    if (this.sideBarModel.isOpen) {
        console.log('close')
        this.sideBarModel.isOpen=false;

    } 
    else {
        console.log("open")
        this.sideBarModel.isOpen=true;

    }
  }
  toggleMenuTitle(){
    if (this.sideBarModel.isOpen && this.sideBarModel.menuTitles.length === 0){
        document.querySelectorAll('.menuTitle').forEach((menuTitle) => {
            this.sideBarModel.menuTitles.push(menuTitle.textContent);
            menuTitle.textContent=menuTitle.textContent[0];
        });
        
    }
    else if(this.sideBarModel.isOpen){
        (document.querySelectorAll('.menuTitle')).forEach((menuTitle,index) => {
            menuTitle.textContent= this.sideBarModel.menuTitles[index][0];
        });
    }
    else{
        (document.querySelectorAll('.menuTitle')).forEach((menuTitle,index) => {
            menuTitle.textContent= this.sideBarModel.menuTitles[index];
        });
    }
  }


  toggleMenuList(){
    document.querySelectorAll('.menuList').forEach(menuList => {
        menuList.addEventListener('animationend', function() {
          this.classList.add('animation-ended');
        });
      });
      
      if (this.sideBarModel.isOpen) {
        document.querySelectorAll('.menuList').forEach(menuList => {
          menuList.classList.remove('menuListCollapseAppear');
          menuList.classList.add('menuListCollapseDisappear');
        });
      } else {
        document.querySelectorAll('.menuList').forEach(menuList => {
          menuList.classList.remove('menuListCollapseDisappear');
          menuList.classList.add('menuListCollapseAppear');
        });

        
      }
        

    // document.querySelectorAll('.menuList').forEach((menuList)=>
    //         menuList.addEventListener('animationend', function() {
    //             if (this.sideBarModel.isOpen){
    //                 menuList.remove('menuListCollapseAppear');
    //                 menuList.add('menuListCollapseDisappear');
    //             }
    //             else{
    //                 menuList.remove('menuListCollapseDisappear');
    //                 menuList.add('menuListCollapseAppear');
    //             }
    //         }, {once: true})
    //     );
  }

    getAllChildElements(element) {
        const childElements = element.children;
        let allChildElements = [];
    
        for (let i = 0; i < childElements.length; i++) {
        const childElement = childElements[i];
        allChildElements.push(childElement);
        allChildElements = allChildElements.concat(this.getAllChildElements(childElement));
        }
  
    return allChildElements;
    }

    getChildElements(element) {
        const childElements = element.children;
        let allChildElements = [];
    
        for (let i = 0; i < childElements.length; i++) {
            const childElement = childElements[i];
            allChildElements.push(childElement);
        }
    return allChildElements;
    }

    collapseMenuList(event){
        if(this.sideBarModel.isOpen){
            var clickedElement=event.target
            console.log(clickedElement.textContent)
            if(clickedElement.className!='menuTitle')
                clickedElement=event.target.closest('.menuTitle');

            var myElement = document.getElementById(clickedElement.textContent);
            console.log(myElement);
            myElement.classList.add('menuListCollapse');
            myElement.classList.remove('menuListCollapseAppear');

            if(myElement.style.visibility!= 'hidden'){
                myElement.style.visibility='hidden';
                myElement.style.height=0;
            }
            else{
                myElement.style='';
            }
            
            console.log(myElement.style.visibility);
            
        }
    }
    collapseMenuSubList(event){
        var clickedElement=event.target
        if(clickedElement.className!='menuName')
            return
        var clickedElementName=clickedElement.textContent
       
        if(clickedElement.className!='menuList')
            clickedElement=event.target.closest('.menuList');
        
        try{
            var myElement = document.getElementById(clickedElementName);
            myElement.classList.toggle('show');
        }
        catch(e){
            console.log(e)
        }
        // const allChildElements = this.getChildElements(clickedElement);
        // allChildElements.forEach(childElement => {
        //     childElement.classList.toggle('show');
        //     // const animationName = window.getComputedStyle(childElement).getPropertyValue('animation-name');
        //     // if (animationName !== 'none') {
        //     // childElement.style.animationName = 'none';
        //     // void childElement.offsetWidth; // Trigger reflow
        //     // childElement.style.animationName = animationName;
        //     // }
        // });
    }

    changeTheme() {
        if (this.sideBarModel.isDarkTheme) {
            document.getElementsByClassName("sidebar")[0].style.backgroundColor = this.sideBarModel.sideBarColorDark;
            document.getElementsByClassName("canvasMain")[0].style.backgroundColor = this.sideBarModel.mainColorDark;
        }
        else{
            document.getElementsByClassName("sidebar")[0].style.backgroundColor = this.sideBarModel.sideBarColorLight;
            document.getElementsByClassName("canvasMain")[0].style.backgroundColor = this.sideBarModel.mainColorLight;
        }
        this.sideBarModel.isDarkTheme=!this.sideBarModel.isDarkTheme;
    }


}

export default SideBarViewModel;