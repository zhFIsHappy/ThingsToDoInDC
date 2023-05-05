import { Route,Switch } from "react-router-dom";
import Home from "../pages/HomePage";
import Search from "../pages/SearchPage";
import Upload from "../pages/UploadPage";
import User from "../pages/UserPage";
import Trend from "../pages/TrendPage";
import MostView from "../pages/ViewPage";
import MostLike from "../pages/LikePage";

import OverView from "../pages/OverViewPage";
import Setting from "../pages/SettingPage";


export default function MyRouter(){
    return(
         <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/user" component={User}/>
            
            <Route exact path="/trend" component={Trend}/>
            <Route exact path="/view" component={MostView}/>
            <Route exact path="/like" component={MostLike}/>
            <Route exact path="/search" component={Search}/>
            <Route exact path="/upload" component={Upload}/>
            <Route exact path="/overview" component={OverView}/>
            <Route exact path="/setting" component={Setting}/>
         </Switch>
    )
}