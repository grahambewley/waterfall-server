const mongoose = require('mongoose');

const connection = {};

async function connectDb() {
    if(connection.isConnected) {
        // Use existing database connection
        console.log("Using existing connection");
        return;
    }

    // Use new database connection
    const db = await mongoose.connect('mongodb+srv://admin:rO5sc57ziiI7hEwP@waterfallonline-hze1z.mongodb.net/test?retryWrites=true&w=majority', {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("DB Connected");
    connection.isConnected = db.connections[0].readyState;
}

module.exports = connectDb;