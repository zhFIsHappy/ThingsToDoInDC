const GADB = require('../utils/GoogleSchemaApiDB')
const  GoogleApiTestData = new GADB(
  { 
    location: {
      longitude:1,
      latitude:1,
      vicinity:"a"
    },
    mandatory: {
      name:"a",
      icon:"a",
      place_id:"a",
      rating:1,
      types:"a",
    },
    optional: {
      kind:0,
    },
    op_map: {
      kind:0,
      mapping:"a"
    },
  }
);
module.exports = GoogleApiTestData;