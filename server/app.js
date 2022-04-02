const express = require('express')
const app = express();
const port = 3000
const routes = require('./routes');
const mongoConnect = require('./utils/dbconnection').mongoConnect;
const bodyParser = require('body-parser');
const compression = require('compression');
const functions = require('firebase-functions')
var ejs = require("ejs").__express;
// Listen on Port 3000
app.listen(process.env.PORT || port, () => console.info(`App listening on port ${port}`))
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb' }));
// app.use(express.urlencoded({
//   extended: true
// }));

// Set View's
app.set('views', './../views');
app.set('view engine', 'ejs');
app.engine(".ejs", ejs);
app.use(compression());

// Navigation
app.use('/', routes);

exports.helloWorld = functions.https.onRequest((request,response)=>{
  response.send("Hello from Firebase")
})

mongoConnect(() => {
    app.listen(4000);
  });
  
