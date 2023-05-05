const express = require('express');
const insertPlace = require('../services/InsertData');
const insertUserInfo = require('../services/InsertData');
// const bodyParser = require('body-parser')
const { getUserInfo } = require('../services/RetrieveData');
const router = express.Router()
const crypto = require('crypto');
const UIDB = require('../utils/UserInfoApiDB')
const jwt = require('jsonwebtoken');
const secret ='28353b30dcfa1c586e56b6Lp&g0$#9Xr6d1c3b8cf8'

const { getAllPlacesDataFromDB, 
        getPlaceDataByType,
        getPlaceByTypeAndRating, 
        getPlaceDataByRating,
        getAllEvents,
        getEventsMapToPlace,
        getEventsByType,
        // getEventByTypeSortByStartDate
        getEventsByDateRange
     } = require('../services/RetrieveData')
const cors = require('cors');
router.use(cors());
// localhost:${port}/api/places/all
router.all('*', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "X-Requested-With,X_Requested_With,Content-Type");

    res.header("Content-Type", "application/json;charset=utf-8");

    next();

});

router.get("/places/all", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Headers","origin, content-type, accept, authorization");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    res.contentType("application/json; charset=UTF-8");
    res.send(await getAllPlacesDataFromDB());
    console.log(`Show all places`)
})

// localhost:${port}/api/places/types=${type}&rating=${rating}&desc=${0/1}
router.get("/places/type=:type&rating=:rating&desc=:order", async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.contentType("application/json;charset=utf-8");
        res.send(await getPlaceByTypeAndRating(req.params.type, req.params.rating, req.params.order));
        // res.send(await getPlaceDataByRating(req.params.rating, req.params.order));
    }catch(e){
        console.log(e);
    }
})

// localhost:${port}/api/places/type/${place_type}
router.get("/places/type/:placeType", async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.contentType("application/json;charset=utf-8");
        res.send(await getPlaceDataByType(req.params.placeType));
    }catch(e){
        console.log(e)
    }
})

// localhost:${port}/api/places/rating/rating=${rating}&desc={0/1}
// order:
//  0 = increase
//  1 = decrease
router.get("/places/rating/rating=:rating&desc=:order", async (req, res) => {
    try {
        // console.log(req.params.rating, req.params.order);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.contentType("application/json;charset=utf-8");
        res.send(await getPlaceDataByRating(req.params.rating, req.params.order));
        // res.send(await getPlaceDataByRating(req.params.rating, req.params.order));
    }catch(e){
        console.log(e);
    }
})


// Events

// localhost:${port}/api/events/all
router.get("/events/all", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(await getAllEvents());
    console.log(`Show all events`)
})

// localhost:${port}/api/events/byplace
router.get("/events/byplace", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.contentType("application/json;charset=utf-8");
    res.send(await getEventsMapToPlace());
    // res.send(await getEventsMapToPlace());
    console.log(`List all events by place`)
})


// localhost:${port}/api/events/type/${event_type}
router.get("/events/type/:eventType", async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(await getEventsByType(req.params.eventType));
    }catch(e){
        console.log(e)
    }
})

// localhost:${port}/api/events/date&desc=${0/1}
// order:
//  0 = increase
//  1 = decrease
// router.get("/events/date", async (req, res) => {
//     try {
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         // res.send(await getEventByTypeSortByStartDate(req.params.order));
//         res.send(await getEventByTypeSortByStartDate(req.params.order));
//     }catch(e){
//         console.log(e)
//     }
// })

router.get("/events/date/startDate/:startDate/endDate/:endDate", async (req, res) => {
    try {
      const daysAfter = parseInt(req.params.startDate) || 0;
      const daysBefore = parseInt(req.params.endDate) || 0;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + daysAfter);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysBefore);
    console.log(startDate.toISOString())
      const events = await getEventsByDateRange(
        new Date(startDate.toISOString()),
        new Date(endDate.toISOString())
      );
    //   console.log(events);
      res.status(200).send(events);
    } catch (e) {
      console.log(e);
      res.status(500).send("Internal Server Error");
    }
  });

router.post("/user/register", async (req, res) =>{
    // res.setHeader("Access-Control-Allow-Origin", '*');
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let saved_places = req.body.saved_places;
    let watched_places = req.body.watched_places;

    if(password.length<6)
    res.status(400).json({ message: 'Registration failed, password length must be greater than 6 digits!' });
    // let {name, email, password, saved_places} = req.body
    const result = await insertUserInfo(name, email , password, saved_places,watched_places)
    if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
    }
    // res.send("User register successful")
})

// router.post("/user/login", async (req, res) =>{
//     let email = req.body.email;
//     let password = req.body.password

//     const result = await getUserInfo(email, password)
//     console.log(result)
//     res.status(result)
//     if(result == 200){
//         res.send("Login successful!")
//     }else{
//         res.send("Username and password doesn't match")
//     }
// })

function comparePasswordHash(password, hash) {
    const [salt, expectedHash] = hash.split(':');
    const actualHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return actualHash === expectedHash;
}

function generatePasswordHash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}
  
function checkToken(req, res, next) {
    // res.setHeader("Access-Control-Allow-Origin", '*');
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const now = Math.floor(Date.now() / 1000);
    jwt.verify(token, secret, (err, decoded) => {
    if (err) {
        res.status(401).json({message: 'Authorization Expired or Unauthorized!'}); 
    } else {
        if (decoded.exp && decoded.exp < now) {
            res.status(401).json({ message: 'Token expired' });
        }
        req.userID = decoded.userID;
        next();
    }});
}

function checkTokenTourist(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const now = Math.floor(Date.now() / 1000);
  jwt.verify(token, secret, (err, decoded) => {
  if (err) {
    next();
  } else {
      if (decoded.exp && decoded.exp < now) {
        next();
      }
      req.userID = decoded.userID;
      next();
  }});
}

router.post("/user/login", async (req, res) =>{
    let email = req.body.email;
    let password = req.body.password
    const user = await UIDB.find({ 'mandatory.email': email });
    if (!user) {
        res.status(401).json({ message: 'Incorrect email'});
        return;
    }
    const correct = comparePasswordHash(password, user[0].mandatory.password);
    if (!correct) {
        res.status(401).json({message: 'Incorrect password'});
        return;
    }
    const payload = { userID: user[0]._id.toString(),exp: Math.floor(Date.now() / 1000) + 3600 };
    const token = jwt.sign(payload, secret);
    // console.log(user[0]._id.toString());
    res.status(200).json({message: 'Logged in successfully',token: token,name: user[0].mandatory.name});
})


router.post("/user/change/password",checkToken,  async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    let userID = req.userID;
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newValue;
    try {
      let user = await UIDB.findById(userID);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if (req.userID != user._id.toString()) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      if(!newPassword||!currentPassword){
        res.status(403).json({ message: 'Must Enter Required Information!' });
        return;
      }
      if(newPassword==currentPassword){
        res.status(403).json({ message: 'NewPassword password should be New!' });
        return;
      }
      const correct = comparePasswordHash(currentPassword, user.mandatory.password);
      if (!correct) {
        res.status(403).json({ message: 'Incorrect current password' });
        return;
      }
      let hashedPassword = generatePasswordHash(newPassword);
      user.mandatory.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


router.post("/user/change/email",checkToken,  async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    let userID = req.userID;
    let currentPassword = req.body.currentPassword;
    let newEmail = req.body.newValue;
    try {
      let user = await UIDB.findById(userID);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if (req.userID != user._id.toString()) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      if(!newEmail||!currentPassword){
        res.status(403).json({ message: 'Must Enter Required Information!' });
        return;
      }
      const correct = comparePasswordHash(currentPassword, user.mandatory.password);
      if (!correct) {
        res.status(403).json({ message: 'Incorrect current password' });
        return;
      }
      const newUser = await UIDB.find({ 'mandatory.email': newEmail });
      if (newUser) {
        res.status(403).json({ message: 'New Email has been used'});
        return;
      }
      user.mandatory.email = newEmail;
      await user.save();
  
      res.status(200).json({ message: 'Email changed successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/user/change/name",checkToken,  async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    let userID = req.userID;
    let currentPassword = req.body.currentPassword;
    let newName = req.body.newValue;
    try {
      let user = await UIDB.findById(userID);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if (req.userID != user._id.toString()) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      if(!newName||!currentPassword){
        res.status(403).json({ message: 'Must Enter Required Information!' });
        return;
      }
      const correct = comparePasswordHash(currentPassword, user.mandatory.password);
      if (!correct) {
        res.status(403).json({ message: 'Incorrect current password' });
        return;
      }
      user.mandatory.name = newName;
      await user.save();
  
      res.status(200).json({ message: 'Email changed successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


router.post("/user/info",checkToken,  async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    let userID = req.userID;
    try {
      let user = await UIDB.findById(userID);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if (req.userID != user._id.toString()) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      res.status(200).json({ message: 'Info load successfully',name:user.mandatory.name, email:user.mandatory.email,settings:{search:user.mandatory.settings.search,style:user.mandatory.settings.style}});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/user/settings",checkToken,  async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  let userID = req.userID;
  try {
    let user = await UIDB.findById(userID);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (req.userID != user._id.toString()) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    user.mandatory.settings = {
      search: req.body.search || user.mandatory.settings.search,
      style: req.body.style || user.mandatory.settings.style
    };
    await user.save();
    res.status(200).json({ message: 'Settings update successfully'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function getStorage(){

  const storage = await UIDB.find({ 'mandatory.email': 'StatisticsFunny' });
  if(!storage){
    const result = await insertUserInfo('Statistics', 'StatisticsFunny' , '12efwrgetw5teagshw3ww', [],[])
    if (!result.success) {
      console.log( result.message);
      res.status(500).json({ message: 'Internal server error'});
    }
  }
  return true;
  
}
async function updateViewWithLock(req, res) {
  try {
    const storage = await UIDB.findOne({ 'mandatory.email': 'StatisticsFunny' }).select('mandatory.watched_places -_id').lean().exec();
    const result = JSON.stringify({
      kind: req.body.kind,
      id: req.body.id,
      name: req.body.name,
      location: req.body.location,
    });
    const existingIndex = storage.mandatory.watched_places.findIndex(place => place.includes(result.split("}")[0]));
    if (existingIndex !== -1) {
      const existingStorage = JSON.parse(storage.mandatory.watched_places[existingIndex]);
      if (req.userID) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const opts = { session, new: true };
          let user = await UIDB.findById(req.userID).session(session);
          if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
          }
          if (req.userID != user._id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
          }
          const existingIndex = user.mandatory.watched_places.findIndex(place => place === result);
          if (existingIndex === -1) {
            existingStorage.statistics = {
              tourists: existingStorage.statistics.tourists,
              users: existingStorage.statistics.users + 1
            };
            user.mandatory.watched_places.push(result);
            storage.mandatory.watched_places.splice(existingIndex, 1, JSON.stringify(existingStorage));
            await user.save(opts);
            await UIDB.updateOne({ 'mandatory.email': 'StatisticsFunny' }, { mandatory: { watched_places: storage.mandatory.watched_places } }).session(session);
            await session.commitTransaction();
            res.status(200).json({ message: 'View Succeed' });
          } else {
            await session.abortTransaction();
            session.endSession();
            res.status(200).json({ message: 'You have viewed this place before' });
          }
        } catch (error) {
          console.log(error);
          await session.abortTransaction();
          session.endSession();
          res.status(500).json({ message: 'Internal server error' });
        }
      } else {
        existingStorage.statistics = {
          tourists: existingStorage.statistics.tourists + 1,
          users: existingStorage.statistics.users
        };
        storage.mandatory.watched_places.splice(existingIndex, 1, JSON.stringify(existingStorage));
        await UIDB.updateOne({ 'mandatory.email': 'StatisticsFunny' }, { mandatory: { watched_places: storage.mandatory.watched_places } });
        res.status(200).json({ message: 'View Succeed' });
      }
    } else {
      const newStorage = req.userID ?
        { ...JSON.parse(result), statistics: { tourists: 0, users: 1 } } :
        { ...JSON.parse(result), statistics: { tourists: 1, users: 0 } };
      storage.mandatory.watched_places.push(JSON.stringify(newStorage));
      await UIDB.updateOne({ 'mandatory.email': 'StatisticsFunny' }, { mandatory: { watched_places: storage.mandatory.watched_places } });
      res.status(200).json({ message: 'View Succeed' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

router.post("/user/views",checkTokenTourist,  async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  await getStorage();
  const storage = await UIDB.findOne({ 'mandatory.email': 'StatisticsFunny' });
  const result=JSON.stringify({
    kind: req.body.kind,
    id:req.body.id,
    name: req.body.name,
    location: req.body.location,
  })
  try {
    const existingIndex = storage.mandatory.watched_places.findIndex(place => place.includes(result.split("}")[0]));
    if (existingIndex !== -1) {
      const existingStorage = JSON.parse(storage.mandatory.watched_places[existingIndex]);
      if(req.userID){
        let userID = req.userID;
        let user = await UIDB.findById(userID);
        if(user.mandatory.watched_places.findIndex(place => place === result)=== -1){
          existingStorage.statistics = {
          tourists: existingStorage.statistics.tourists ,
          users: existingStorage.statistics.users+ 1
          };
        }
      }
      else
          existingStorage.statistics = {
          tourists: existingStorage.statistics.tourists + 1,
          users: existingStorage.statistics.users
        };
      storage.mandatory.watched_places.splice(existingIndex, 1, JSON.stringify(existingStorage));
    }
    else {
      const newStorage = req.userID ?
      { ...JSON.parse(result), statistics: { tourists: 0, users: 1 } } :
      { ...JSON.parse(result), statistics: { tourists: 1, users: 0 } };
      storage.mandatory.watched_places.push(JSON.stringify(newStorage));
    }
    await storage.save();
    // const alreadyExists = storage.mandatory.watched_places.some(place => place === result)
    // if(!alreadyExists){
    //   storage.mandatory.watched_places.push(result);
    //   await storage.save();
    // }
  }
  catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }

  if(req.userID){
    let userID = req.userID;
    try {
      let user = await UIDB.findById(userID);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if (req.userID != user._id.toString()) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const existingIndex = user.mandatory.watched_places.findIndex(place => place === result);
      if (existingIndex !== -1) {
        user.mandatory.watched_places.splice(existingIndex, 1);
      }
      user.mandatory.watched_places.push(result);
      await user.save();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.post("/user/likes",checkTokenTourist,  async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  await getStorage();
  const storage = await UIDB.findOne({ 'mandatory.email': 'StatisticsFunny' });
  const result=JSON.stringify({
    kind: req.body.kind,
    id:req.body.id,
    name: req.body.name,
    location: req.body.location,
  })
  try {
    const existingIndex = storage.mandatory.saved_places.findIndex(place => place.includes(result.split("}")[0]));
    if (existingIndex !== -1) {
      const existingStorage = JSON.parse(storage.mandatory.saved_places[existingIndex]);
      if(req.userID){
        let userID = req.userID;
        let user = await UIDB.findById(userID);
        if(user.mandatory.saved_places.findIndex(place => place === result)=== -1){
          existingStorage.statistics = {
          tourists: existingStorage.statistics.tourists ,
          users: existingStorage.statistics.users+ 1
          };
        }
        else{
          existingStorage.statistics = {
            tourists: existingStorage.statistics.tourists ,
            users: existingStorage.statistics.users- 1
          };
        }
      }
      else
          existingStorage.statistics = {
          tourists: existingStorage.statistics.tourists + 1,
          users: existingStorage.statistics.users
        };
      storage.mandatory.saved_places.splice(existingIndex, 1, JSON.stringify(existingStorage));
    }
    else {
      const newStorage = req.userID ?
      { ...JSON.parse(result), statistics: { tourists: 0, users: 1 } } :
      { ...JSON.parse(result), statistics: { tourists: 1, users: 0 } };
      storage.mandatory.saved_places.push(JSON.stringify(newStorage));
    }
    await storage.save();
    // const existingIndex = storage.mandatory.saved_places.findIndex(place => place === result);
    // if (existingIndex !== -1) {
    //   storage.mandatory.saved_places.splice(existingIndex, 1);
    //   await storage.save();
    // }
    // else{
    //   storage.mandatory.saved_places.push(result);
    //   await storage.save();
    // }
  }
  catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }

  if(req.userID){
    let userID = req.userID;
    try {
      let user = await UIDB.findById(userID);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      if (req.userID != user._id.toString()) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const existingIndex = user.mandatory.saved_places.findIndex(place => place === result);
      if (existingIndex !== -1) {
        user.mandatory.saved_places.splice(existingIndex, 1);
        await user.save();
        res.status(200).json({ message: 'Cancel Like Succeed' });
      }
      else{
        user.mandatory.saved_places.push(result);
        await user.save();
        res.status(200).json({ message: 'User Like Succeed' });
      }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  else
    res.status(200).json({ message: 'Tourist Like Succeed' });
});

router.post("/user/likeInfo",checkToken,  async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  let userID = req.userID;
  try {
    let user = await UIDB.findById(userID);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (req.userID != user._id.toString()) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const likedPlaces = user.mandatory.saved_places.map(place => JSON.parse(place));
    res.status(200).json({ likedPlaces });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/user/viewInfo",checkToken,  async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  let userID = req.userID;
  try {
    let user = await UIDB.findById(userID);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (req.userID != user._id.toString()) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const watchedPlaces = user.mandatory.watched_places.map(place => JSON.parse(place));
    res.status(200).json({ watchedPlaces });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function measureScore(tourists,users){
  return Math.sqrt(tourists+users*500);
}
router.post("/trend/tag",  async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  const storage = await UIDB.findOne({ 'mandatory.email': 'StatisticsFunny' });
  if(!storage)
    res.status(403).json({ message:"Not Enough Data For Analysis" });
  try {
    const statisticsSaved = {};
    [...storage.mandatory.saved_places].forEach((place) => {
      const data = JSON.parse(place);
      const kind = data.kind;
      const id = data.id;
      const name = data.name;
      const location = data.location;
      const tourists = data.statistics.tourists;
      const users = data.statistics.users;
      const info = JSON.stringify({ kind: kind, id: id, name: name, location: location,tourists:tourists,users:users });
      statisticsSaved[info] = {
        tourists: tourists,
        users: users,
        sum: tourists + users,
      };
    });
    const statisticsWatched = {};
    [...storage.mandatory.watched_places].forEach((place) => {
      const data = JSON.parse(place);
      const kind = data.kind;
      const id = data.id;
      const name = data.name;
      const location = data.location;
      const tourists = data.statistics.tourists;
      const users = data.statistics.users;
      const sum=tourists + users;
      const info = JSON.stringify({ kind: kind, id: id, name: name, location: location,tourists:tourists,users:users });
      statisticsWatched[info] = {
        tourists: tourists,
        users: users,
        sum: tourists + users,
      };
    });
    const sortedSavedInfo = Object.keys(statisticsSaved).sort((a, b) => {
      return measureScore(statisticsSaved[b].tourists,statisticsSaved[b].users) - measureScore(statisticsSaved[a].tourists,statisticsSaved[a].users);
    }).slice(0, 10);
    
    const topSavedInfo = sortedSavedInfo.map(info => JSON.parse(info));

    const sortedViewedInfo = Object.keys(statisticsWatched).sort((a, b) => {
      return measureScore(statisticsWatched[b].tourists,statisticsWatched[b].users) - measureScore(statisticsWatched[a].tourists,statisticsWatched[a].users);
    }).slice(0, 10);
    
    const topViewedInfo = sortedViewedInfo.map(info => JSON.parse(info));
    res.status(200).json({viewInfo:topViewedInfo,likeInfo:topSavedInfo});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  
module.exports = router