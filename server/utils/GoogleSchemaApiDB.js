const mongoose = require('mongoose');
const GoogleSchema = require('../models/GoogleApi');
const connectToMongoDB = require('../../database/MongoDb')
connectToMongoDB
const GoogleApiSchema = new mongoose.Schema(GoogleSchema)
const GADB = mongoose.model('GADB', GoogleApiSchema);
module.exports = GADB