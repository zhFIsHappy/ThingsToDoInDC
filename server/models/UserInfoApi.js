const mongoose = require('mongoose')
const UserInfoApi = {
  mandatory: {
    name:{
      type: String,
      required: [true],
      trim: true,
      default:"Empty",
    },
    email:{
      type: String,
      required: [true],
      trim: true
    },
    password:{
      type: String,
      required: [true],
      trim: true,
    },
    settings:{
      search:{
        type: String,
        required: [false],
        trim: true,
        default:"both",
      },
      style:{
        type: String,
        required: [false],
        trim: true,
        default:"night"
      }
    },
    saved_places:{
      type: [String],
      required: [true],
      trim: true,
    },
    watched_places:{
      type: [String],
      required: [true],
      trim: true,
    },
  },
}

module.exports = UserInfoApi;