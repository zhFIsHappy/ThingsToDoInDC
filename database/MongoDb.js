const mongoose = require('mongoose')
require('dotenv').config()

function connectToMongoDB(){
    mongoose.connect(
        process.env.DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )

    const db = mongoose.connection;

    db.once('open' ,() => {
    console.log('Connected');
    })

    db.on('error', function(e) {
        console.error('Error in MongoDb connection: ' + e);
        mongoose.disconnect();
    });

    db.on('close', function() {
        console.log('Reconnecting');
        mongoose.connect(config.url, {server:{auto_reconnect:true}});
    });
    
}


module.exports = connectToMongoDB()