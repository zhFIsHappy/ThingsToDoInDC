const getJSON = require('./RetrieveData')
const db = require('../../database/MongoDb')
const mongoose = require('mongoose');
const GeneralSchema = require('../models/GoogleApi');
const GoogleApiSchema = new mongoose.Schema(GeneralSchema)
const GADB = require('../utils/GoogleSchemaApiDB')

// async function deleteData() {

async function removeData(){
    GADB.deleteMany({}).then(function(){
        console.log("Data deleted");
        process.exit(0);
    }).catch(function(e){
        console.log(e);
    })
}


// removeData()
//module.exports = removeData;