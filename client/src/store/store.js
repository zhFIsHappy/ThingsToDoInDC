import { observable,action ,reaction } from "mobx";

const user = observable({
    userName:'NotLogin',
    userEmail:'NotLogin',
    userPassword:'NotLogin',
    sessionId:'NotLogin'
})

user.setName=action(value=>{
    user.userName=value
})
user.setEmail=action(value=>{
    user.userEmail=value;
})
user.setPassword=action(value=>{
    user.userPassword= value;
})
user.setSessionId=action(value=>{
    user.sessionId=value;
})

const savedUser = JSON.parse(localStorage.getItem('user'));
if (savedUser) {
  user.setSessionId(savedUser.sessionId);
}
reaction(
    () => ({ sessionId: user.sessionId }),
    (data) => {
      localStorage.setItem('user', JSON.stringify(data));
    }
);

const settings = observable({
    search:'both',
    style:'night'
})

settings.setSearch=action(value=>{
    settings.search=value;
})

settings.setStyle=action(value=>{
    settings.style=value;
})

const mapSize = observable({
    width: '1000px',
    height: '750px'
})

mapSize.setWidth=action(value=>{
    mapSize.width=value
})

mapSize.setHeight=action(value=>{
    mapSize.height=value;
})

export default {user,settings,mapSize}