const mongoose = require('mongoose')

const GoogleApiSchema = {
  location: {
    longitude:{
      type: mongoose.Decimal128,
      required: [true],
      trim: true,
      default:0
    },
    latitude:{
      type: mongoose.Decimal128,
      required: [true],
      trim: true,
      default:0
    },
    vicinity:{
      type: String,
      required: [true],
      trim: true,
      default:"Empty"
    },
  },
  mandatory: {
    name:{
      type: String,
      required: [true],
      trim: true,
      default:"Empty",
    },
    icon:{
      type: String,
      required: [true],
      trim: true,
      default:"Empty"
    },
    place_id:{
      type: String,
      required: [true],
      trim: true,
    },
    // not available every object
    rating:{
      type: Number,
      required: [true],
      trim: true,
    },
    // modified to array
    types:{
      type: [String],
      required: [true],
      trim: true,
    },
  },
  optional: {
    kind:{
      type: Number,
      required: [true]
    },
    entity:{
      type: Map,
      required: [false]
    },
  },
  op_map:{
    kind:{
      type: Number,
      required: [true],
      trim: true,
    },
    mapping:{
      type: String,
      required: [true],
      trim: true,
    },
  }
}

module.exports = GoogleApiSchema;