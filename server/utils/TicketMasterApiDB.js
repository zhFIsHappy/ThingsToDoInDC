const mongoose = require('mongoose');
const TicketMasterSchema = require('../models/TicketMasterApi');
const connectToMongoDB = require('../../database/MongoDb')
connectToMongoDB
const TicketMasterApiSchema = new mongoose.Schema(TicketMasterSchema)
const TMDB = mongoose.model('TMDB', TicketMasterApiSchema);
module.exports = TMDB