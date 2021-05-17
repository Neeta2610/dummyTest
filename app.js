const express = require('express')
const app = express();
const port = 5000
const routes = require('./routes');
const mongoConnect = require('./utils/dbconnection').mongoConnect;
const bodyParser = require('body-parser');
const compression = require('compression');
var ejs = require("ejs").__express;
// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb' }));
// app.use(express.urlencoded({
//   extended: true
// }));

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');
app.engine(".ejs", ejs);
app.use(compression());

// Navigation
app.use('/', routes);

mongoConnect(() => {
    app.listen(4000);
  });
  
