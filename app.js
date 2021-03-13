var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
//var rateLimit = require("express-rate-limit");



var app = express();
var server = http.createServer(app);

/* const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}); */

// Database Settings
var db = new sqlite3.Database('./database/employees.db');
//db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');
db.run('CREATE TABLE IF NOT EXISTS user(userName TEXT, Password TEXT)');
db.run('CREATE TABLE IF NOT EXISTS devices(id INTEGER, device TEXT, os TEXT, manufacturer TEXT, lastCheckedOutDate TEXT, lastCheckedOutBy	TEXT, isCheckedOut	TEXT)');

//devices(id INTEGER, device 	TEXT, os TEXT, manufacturer	TEXT, lastCheckedOutDateTEXT, lastCheckedOutBy	TEXT, isCheckedOut	TEXT
//)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());
//app.use(limiter);


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/form.html'));
});



// Add New User
app.post('/add', function (req, res) {
  db.serialize(() => {
    db.run('INSERT INTO user(userName,password) VALUES(?,?)', [req.body.userName, req.body.password], function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New user has been added");
      res.send("New employee has been added into the database with ID = " + req.body.userName);
      //alert("New employee has been added into the database with ID = " + req.body.id + " and Name = " + req.body.name);
    });

  });

});

// Get User By ID
app.post('/view', function (req, res) {
  db.serialize(() => {
    db.each('SELECT id ID, name NAME FROM emp WHERE id =?', [req.body.id], function (err, row) {
      //db.each() is only one which is funtioning while reading data from the DB
      /* var empid= row.ID;
     if ( empid ===" ")
     {
      res.send("No such record exists");
      return console.error(err.message);
     } */

      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
      console.log("Entry displayed successfully");
    });
  });
});


// Closing the database connection.
app.get('/close', function (req, res) {
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });

});



server.listen(3001, function () {
  console.log("server is listening on port: 3000");
})