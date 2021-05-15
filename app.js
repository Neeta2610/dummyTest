const express = require('express')
const app = express()
const port = 5000
const routes = require('./routes');
const mongoConnect = require('./utils/dbconnection').mongoConnect;
// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))
app.use(express.static('public'));

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

// Navigation
app.use('/', routes);

mongoConnect(() => {
    app.listen(4000);
  });
  
