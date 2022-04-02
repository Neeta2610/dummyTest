const mongodb = require('mongodb');
const config = require('../config.json');
const MongoClient = mongodb.MongoClient;
const dbOptions = config.mongodb.options;
const emailer = require('../services/main')

module.exports.dbNameUrl = function () {
    var dbName = (config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db);

    if (config.mongodb.username && config.mongodb.password) {
        dbName = config.mongodb.username + ":" + config.mongodb.password + "@" + dbName;
    }

    if (dbName.indexOf('mongodb://') !== 0) {
        dbName = 'mongodb://' + dbName;
    }
    return dbName;
}
let _db;

const mongoConnect = callback => {
  
    var dbName = this.dbNameUrl();
    console.log(dbName);
    MongoClient.connect(
        dbName, dbOptions
    )
        .then(client => {
            console.log('Database Connected!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

process.on('message', async (message) => {
    console.log("message : ", message);
    mongoConnect(async () => {
        const db = getDb();
        if (message.process === "send-email-process") {
            await emailer.newsletters(db);
        }
    });

});

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

const closeDb = () => {
    _db.close();
    return;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.closeDb = closeDb;
