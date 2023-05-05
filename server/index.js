require('dotenv').config()

const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require('express')
const crypto = require('crypto');
const router = require('./router/routes')
const app = express()
const jwt = require('jsonwebtoken');
const uri = process.env.DB_URI
const port = process.env.port || 4000
const secret ='28353b30dcfa1c586e56b6Lp&g0$#9Xr6d1c3b8cf8'

app.use(express.json())
app.use('/api', router)


console.log(uri)

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function connectDB() {
  try {
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected To MongoDB Successfully!!");
  } catch (e) {
    console.log(e);
  }
}

connectDB();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)Th
//     await client.connect();

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Connected To MongoDB Successfully!!");

//     app.listen(port, () => {
//         console.log(`Server listening on port ${port}`);
//     })

//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }


// run().catch(console.dir);


