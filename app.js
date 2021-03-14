//  --------------------------------------------------- Begin Required Node Modules-----------------------------------------------------------------------
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
//var rateLimit = require("express-rate-limit");

//  --------------------------------------------------- End Required Node Modules-----------------------------------------------------------------------

//  --------------------------------------------------- Begin Database Settings -----------------------------------------------------------------------
var db = new sqlite3.Database('./database/jandj.db');
db.run('CREATE TABLE IF NOT EXISTS user("id"	INTEGER NOT NULL,"userName"	TEXT NOT NULL,"password"	TEXT NOT NULL,"userGroup"	TEXT NOT NULL,PRIMARY KEY("id" AUTOINCREMENT)');
db.run('CREATE TABLE IF NOT EXISTS devices("id"	INTEGER NOT NULL,"device"	TEXT NOT NULL,	"os"	TEXT NOT NULL,"manufacturer"	TEXT NOT NULL,"lastCheckedOutDate"	TEXT,"lastCheckedOutBy"	TEXT,"isCheckedOut"	TEXT NOT NULL,PRIMARY KEY("id" AUTOINCREMENT)');

//  --------------------------------------------------- End Database Settings -----------------------------------------------------------------------

//  --------------------------------------------------- Begin App Settings -----------------------------------------------------------------------
var app = express();
var server = http.createServer(app);

/* const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}); */


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());
//app.use(limiter);


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/form.html'));
});

//  --------------------------------------------------- End App Settings ---------------------------------------------------------------------------


//  --------------------------------------------------- Begin User CRUD Functions -----------------------------------------------------------------------
// Add New User
app.post('/Add', function (req, res) {
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


//  --------------------------------------------------- End User CRUD Functions -----------------------------------------------------------------------

//  --------------------------------------------------- Begin Inventory Loan CRUD Functions -----------------------------------------------------------------------

//  --------------------------------------------------- End Inventory Loan CRUD Functions -----------------------------------------------------------------------


//  --------------------------------------------------- Begin Close The Database Connection -----------------------------------------------------------------------
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
//  --------------------------------------------------- End Close The Database Connection -----------------------------------------------------------------------




//  --------------------------------------------------- Begin Server Listen Port -----------------------------------------------------------------------
server.listen(3000, function () {
  console.log("server is listening on port: 3000");
});

//  --------------------------------------------------- End Server Listen Port -----------------------------------------------------------------------