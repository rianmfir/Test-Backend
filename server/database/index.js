const mongoose = require('mongoose');
const { dbHost, dbPass, dbName, dbPort, dbUser } = require('../app/config');

mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}?authSource=admin`)
    .then(res => console.log("Database Connected"))
    .catch(err => console.log("DB Error"));

const db = mongoose.connection;

module.exports = db;
