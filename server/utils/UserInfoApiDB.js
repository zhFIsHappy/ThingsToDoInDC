const mongoose = require('mongoose');
const UserInfoSchema = require('../models/UserInfoApi');
const connectToMongoDB = require('../../database/MongoDb')
connectToMongoDB
const UserInfoApiSchema = new mongoose.Schema(UserInfoSchema)
const UIDB = mongoose.model('UIDB', UserInfoApiSchema);
module.exports = UIDB