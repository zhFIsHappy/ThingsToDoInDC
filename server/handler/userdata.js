const express = require('express')
const router = express.Router();
const insertUserInfo = require('../services/InsertData');
const { getUserInfo } = require('../services/RetrieveData');
 const cors = require('cors');
 router.use(cors());
router.post("/user/register", async (req, res) =>{
    res.setHeader("Access-Control-Allow-Origin", '*');
    let {name, email, password, saved_places} = req.body.data
    const result = await insertUserInfo(name, email , password, saved_places)
    if (result) {
        console.log('User registered successfully!');
        res.status(200).json({ message: 'User registered successfully!' });
      } else {
        console.log('User registration failed.');
        res.status(400).json({ message: 'User registration failed.' });
    }
})

router.post("/user/login", async (req, res) =>{
    let {name, email, password} = req.body.data
    // boolean validLogin = 
    //TODO: Check if Valid
    const result = await getUserInfo(name)
    if(result == 200){
        res.send(200)
    }else{
        res.send(400)
    }
})