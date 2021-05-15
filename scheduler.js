const express = require('express');
var path = require('path');
const config = require('./config');
const cron = require('node-cron');
const app = express();

// node cron for Email Send
cron.schedule('* * * * *', function () {
    const fork = require('child_process').fork;
    const ls = fork(path.join(__dirname, 'utils/', 'dbconnection.js'));
    ls.send({ process: "send-email-process" });
    console.log('running a task every 5 minute');
});


app.listen(4001);
console.log("scheduler started");