//  --------------------------------------------------- Begin Required Node Modules-----------------------------------------------------------------------
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');

//  --------------------------------------------------- End Required Node Modules-----------------------------------------------------------------------

//  --------------------------------------------------- Begin Database Settings -----------------------------------------------------------------------
var db = new sqlite3.Database('./database/jandj.db');
db.run('CREATE TABLE IF NOT EXISTS user(id	INTEGER NOT NULL ,userName	TEXT NOT NULL, password	TEXT NOT NULL, userGroup	TEXT NOT NULL,PRIMARY KEY(id AUTOINCREMENT))');
db.run('CREATE TABLE IF NOT EXISTS devices(id	INTEGER NOT NULL, device	TEXT NOT NULL,	os	TEXT NOT NULL, manufacturer	TEXT NOT NULL, lastCheckedOutDate	TEXT, lastCheckedOutBy	TEXT, isCheckedOut	TEXT NOT NULL, PRIMARY KEY(id AUTOINCREMENT))');

//  --------------------------------------------------- End Database Settings -----------------------------------------------------------------------

//  --------------------------------------------------- Begin App Settings -----------------------------------------------------------------------
var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());

//  --------------------------------------------------- End App Settings ---------------------------------------------------------------------------


//  --------------------------------------------------- Begin Global Variables -----------------------------------------------------------------------

var loggedInName = "";

//  --------------------------------------------------- End Global Variables -----------------------------------------------------------------------


//  --------------------------------------------------- Begin User CRUD Functions -----------------------------------------------------------------------
// Add New User
app.post('/AddUser', function (req, res) {
  db.serialize(() => {
    db.run('INSERT INTO user(userName,password,userGroup) VALUES(?,?,?)',
      [req.body.userName, req.body.password, "Staff"],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("New user has been added");
        res.send("New user has been added into the database with ID = " + req.body.userName);
      });

  });
});

// Get User By ID
app.get('/ViewUserByID', function (req, res) {
  db.serialize(() => {
    db.each('SELECT id ID, userName NAME, userGroup UserGroup FROM user WHERE id =?', [req.body.id], function (err, row) {
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID},    Name: ${row.NAME}, User Group: ${row.UserGroup}`);
      console.log("Details for the requested User Id is  displayed successfully");
    });
  });
});

// Get All Users
app.get('/ViewAllUsers', function (req, res) {
  db.serialize(() => {
    db.each('SELECT id ID, userName NAME, userGroup UserGroup FROM user', function (err, row) {
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID},    Name: ${row.NAME}, User Group: ${row.UserGroup}`);
      console.log("Deatails for all Users are displayed successfully");
    });
  });
});


// User Login
app.get('/Login', function (req, res) {
  db.serialize(() => {
    db.each('SELECT userName NAME FROM user WHERE id=? and password =?', [req.body.id, req.body.password], function (err, row) {
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      loggedInName = (`${row.NAME}`);
      res.send(` Name: ${row.NAME}`);
      console.log(loggedInName & " has logged in successfully");
    });
  });
});

//Update Password
app.put('/Update/Password/:id', function (req, res) {
  db.serialize(() => {
    db.run('UPDATE user SET password = ? WHERE id = ?', [req.body.password, req.body.id], function (err) {
      if (err) {
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("User Password updated successfully");
      console.log("User Password updated successfully");
    });
  });
});

//Update User Group
app.put('/Update/UserGroup/:id', function (req, res) {
  db.serialize(() => {
    db.run('UPDATE user SET userGroup = ? WHERE id = ?', [req.body.UserGroup, req.body.id], function (err) {
      if (err) {
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("User Group updated successfully");
      console.log("User Group updated successfully");
    });
  });
});

// Delete User
app.delete('/DeleteUser', function (req, res) {
  db.serialize(() => {
    db.run('DELETE FROM user WHERE id = ?', req.body.id, function (err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("User deleted");
      console.log("User deleted");
    });
  });
});

//  --------------------------------------------------- End User CRUD Functions -----------------------------------------------------------------------

//  --------------------------------------------------- Begin Inventory Loan CRUD Functions -----------------------------------------------------------------------

//Add New Device
app.post('/AddDevice', function (req, res) {
  db.serialize(() => {
    var deviceCount = "SELECT COUNT(*) FROM devices;";
    if (deviceCount = 10) {
      console.log("A new device cannot be added as the inventory already has the maximum number of devices");
    }
    db.run('INSERT INTO devices(device,os,manufacturer,lastCheckedOutDate,lastCheckedOutBy,isCheckedOut) VALUES(?,?,?,?,?,?)',
      [req.body.device, req.body.os, req.body.manufacturer, null, null, "false"],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("New device has been added");
        res.send("New user has been added into the database with ID = " + req.body.userName);
      });

  });
});

// Delete Device
app.delete('/DeleteDevice/', function (req, res) {
  db.serialize(() => {
    db.run('DELETE FROM devices WHERE id = ?', req.body.id, function (err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Device deleted");
      console.log("Device deleted");
    });
  });
});
// Get All Devices
app.get('/ViewAllDevices', function (req, res) {
  db.serialize(() => {
    db.each('SELECT device Device,os OS,manufacturer Manufacturer,lastCheckedOutDate LastCheckedOutDate,lastCheckedOutBy LastCheckedOutBy,isCheckedOut IsCheckedOut FROM devices?', function (err, row) {
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(`ID: ${row.ID}, Device: ${row.device}, OS: ${row.os}, Manufacturer: ${row.manufacturer}, Last Checked Out Date: ${row.lastCheckedOutDate}, Last Checked Out By: ${row.lastCheckedOutBy}, Is Checked Out: ${row.isCheckedOut}`);
      console.log("Details for all devices are displayed successfully");
    });
  });
});

// Get Device By ID
app.get('/ViewDeviceById', function (req, res) {
  db.serialize(() => {
    db.each('SELECT device,os,manufacturer,lastCheckedOutDate,lastCheckedOutBy,isCheckedOut FROM devices WHERE id =?', [req.body.id], function (err, row) {     //db.each() is only one which is funtioning while reading data from the DB
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID}, Device: ${row.device}, OS: ${row.os}, Manufacturer: ${row.manufacturer}, Last Checked Out Date: ${row.lastCheckedOutDate}, Last Checked Out By: ${row.lastCheckedOutBy}, Is Checked Out: ${row.isCheckedOut}`);
      console.log("Details for the requested device Id is  displayed successfully");
    });
  });
});

// Get Checked Out Devices
app.get('/ViewCheckedOutDevice', function (req, res) {
  db.serialize(() => {
    db.each('SELECT device,os,manufacturer,lastCheckedOutDate,lastCheckedOutBy,isCheckedOut FROM devices WHERE id =?', ["true"], function (err, row) {     //db.each() is only one which is funtioning while reading data from the DB
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID}, Device: ${row.device}, OS: ${row.os}, Manufacturer: ${row.manufacturer}, Last Checked Out Date: ${row.lastCheckedOutDate}, Last Checked Out By: ${row.lastCheckedOutBy}, Is Checked Out: ${row.isCheckedOut}`);
      console.log("Details for the requested device Id is  displayed successfully");
    });
  });
});

// Get Not Checked Out Devices
app.get('/ViewNotCheckedOutDevice', function (req, res) {
  db.serialize(() => {
    db.each('SELECT device,os,manufacturer,lastCheckedOutDate,lastCheckedOutBy,isCheckedOut FROM devices WHERE id =?', ["false"], function (err, row) {     //db.each() is only one which is funtioning while reading data from the DB
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID}, Device: ${row.device}, OS: ${row.os}, Manufacturer: ${row.manufacturer}, Last Checked Out Date: ${row.lastCheckedOutDate}, Last Checked Out By: ${row.lastCheckedOutBy}, Is Checked Out: ${row.isCheckedOut}`);
      console.log("Details for the requested device Id is  displayed successfully");
    });
  });
});

// Get Device Checked Out By Staff
app.get('/ViewDeviceByStaff', function (req, res) {
  db.serialize(() => {
    db.each('SELECT device,os,manufacturer,lastCheckedOutDate,lastCheckedOutBy,isCheckedOut FROM devices WHERE lastCheckedOutBy =?', [loggedInName], function (err, row) {     //db.each() is only one which is funtioning while reading data from the DB
      if (err) {
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` ID: ${row.ID}, Device: ${row.device}, OS: ${row.os}, Manufacturer: ${row.manufacturer}, Last Checked Out Date: ${row.lastCheckedOutDate}, Last Checked Out By: ${row.lastCheckedOutBy}, Is Checked Out: ${row.isCheckedOut}`);
      console.log("Details for the requested device Id is  displayed successfully");
    });
  });
});

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