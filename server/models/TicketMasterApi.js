const mongoose = require('mongoose')

const TicketMasterApi = {
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
      default:"Unknown"
    },
    name:{
        type: String,
        required: [true],
        trim: true,
        default: "Unknown"
    }
  },
  mandatory: {
    name:{
      type: String,
      required: [true],
      trim: true,
      default:"Empty",
    },
    // icon:{
    //   type: String,
    //   required: [true],
    //   trim: true,
    //   default:"Empty"
    // },
    event_id:{
      type: String,
      required: [true],
      trim: true,
    },
    start_date:{
      type: Date,
      required: [true],
      trim: true
    },
    // modified to array
    types:{
      type: [String],
      required: [true],
      trim: true,
      default: []
    },
  },
  optional:{
    url:{
      type: String,
      trim: true,
      required: [false]
    },
    maxTicketPrice:{
      type: Number,
      trim: true,
      required: [false]
    },
    minTicketPrice:{
      type: Number,
      trim: true,
      required: [false]
    },
    info:{
      type: String,
      trim: true,
      required: [false]
    },
    img_url:{
      type: String,
      trim: true,
      required: [false]
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

module.exports = TicketMasterApi;