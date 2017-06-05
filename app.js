var express = require("express");
var session = require("express-session");
var mongoose = require('mongoose'); 
var bodyParser = require("body-parser");
var exphbs = require('express-handlebars');
var helpers = require('handlebars-helpers')();
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var configDB 					= require('./config/database.js');
var path    					= require("path");
var passport = require("passport");
var flash    					= require('connect-flash');


var auth_route 					= require("./routes/auth.js");
var index_route 				= require("./routes/index.js");


var app = express();


if(mongoose.connect(configDB.url)) {
	console.log("Connected to database!");
}else {
	console.log("Failed to connecto to database");
}



app.use(morgan('dev')); // log every request to the console
// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(express.static(__dirname + '/public'));



// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');



// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 600000 }
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.DOMAIN = req.headers.host;
  next();
});


app.use('/auth', auth_route);
app.use('/index', index_route);

app.get('/', function(req,res) {
  if (!req.user) return res.redirect("/auth/register");
	console.log(req.session);
	return res.redirect('/index');
});


app.listen(5100, function () {
  console.log('Example app listening on port 1000!')
})