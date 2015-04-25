var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;

var session         = require('express-session');

var MongoClient     = require('mongodb').MongoClient;
var ObjectID        = require('mongodb').ObjectID;

// Mongodb
var db;
var users;
var lines;

var url = 'mongodb://localhost:27017/victory-index';
MongoClient.connect(url, function(err, _db) {
  console.log("Connected correctly to server");
  db = _db;
  users = db.collection('users');
  lines = db.collection('lines');
});

// Passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));


var app             = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'asfdasfasdfasdfasdfsadf'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', 
  passport.authenticate('local'),
  function(req, res) {
    res.redirect('/#/admin/lines');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/#/login');
});

/*---------------------------------------------
*                    API
*--------------------------------------------*/

app.get('/api/users', ensureAdmin, function(req, res, next){
  users.find({role: { $ne: 'ADMIN' }}).toArray(function(err, result){
    res.send(result);
  });
});

app.delete('/api/users/:id', ensureAdmin, function(req, res, next){
  deleteUser(req.params.id);
  res.send('ok');
});

app.post('/api/users', ensureAdmin, function(req, res, next){
  createUser(req.body);
  res.send('ok');
});

// ---------------------

app.post('/api/lines', ensureAuthenticated, function(req, res, next){
  createLine(req.body);
  res.send('ok');
});

app.delete('/api/lines/:id', ensureAuthenticated, function(req, res, next){
  deleteLine(req.params.id);
  res.send('ok');
});

app.get('/api/lines', ensureAuthenticated, function(req, res, next){
  lines.find({}).toArray(function(err, result){
    res.send(result);
  });
});

//-----------------

app.get('/lines/:q', function(req, res, next){
  getLines(req.params.q, function(result){
    res.send(result);
  });
});

app.get('/lines', function(req, res, next){
  getLines(null, function(result){
    res.send(result);
  });
});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

/*---------------------------------------------
*                    Function
*--------------------------------------------*/

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role == 'ADMIN') { return next(); }
  var err = new Error('Unauthorized');
  err.status = 401;
  next(err);
}
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  var err = new Error('Unauthorized');
  err.status = 401;
  next(err);
}
function findById(id, fn) {
  users.find({id : id}).toArray(function(err, docs) {
    if(err) {
      fn(new Error('User ' + id + ' does not exist'));
    }else{
      if(docs[0]) {
        fn(null, docs[0]);
      }
    }
  });
}
function findByUsername(username, fn) {
  users.find({username : username}).toArray(function(err, docs) {
    if(err) {
      return fn(null, null);
    }else{
      if(docs[0]) {
        return fn(null, docs[0]);
      }else{
        return fn(null, null);
      }
    }
  });
}

// User
function InsertUser(db, callback) {
  // Get the documents collection
  var collection = db.collection('users');
  // Insert some documents
  collection.insert([
    { id: 1, username: 'user', password: 'pass', email: 'user@example.com', role: 'USER' }, 
    { id: 2, username: 'admin', password: 'pass', email: 'joe@example.com', role: 'ADMIN' }
  ], function(err, result) {
    console.log("Inserted 2 documents into the document collection");
    callback(result);
  });
}

function deleteUser(id) {
  users.remove({_id: new ObjectID(id)});
}

function createUser(data){
  users.insert(data,function(err, result) {

  });
}

// Line
function createLine(data){
  lines.insert(data,function(err, result) {

  });
}
function deleteLine(id) {
  lines.remove({_id: new ObjectID(id)});
}


function getLines(q, callback){
  if(q) {
    q = { destination: {'$regex' : q}};
  }else {
    q = {};
  }
  lines.aggregate(
    [
      {
        $match: q
      },
      {
        $group:
        {
          _id: "$destination",
          lines: { $push:  { 
            number: "$number", 
            victoryCorner: "$victoryCorner",
            tel: "$tel"
          } }
        }
      }
    ], function(err, result) {
      callback(result);
    }
  );
}



