var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;


/*
ROUTE: /auth/register
*/
router.get("/register", function (req,res) {
	res.locals.title = "Feeddit -  Registracija";
	return res.render("pages/register",{layout: "layout",error: req.flash('message')});
});
/*
ROUTE: /auth/register
*/
router.post('/register', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var date_created = new Date();

	if (username && password){
			User.checkUsername(username,function (err,user){
			    	if (err) {
			            return res.status(500).json({ error: true});
			        }
					if (!user) { //
						var newUser = new User({
						    username : username,
						    password : password,
						    created : date_created
						});

						User.createUser(newUser, function(err, user){
					    	if (err) {
					            return res.status(500).json({ error: true});
					        }
							return res.redirect("/auth/login");
						});
						
					}else {
						return res.render("pages/register",{message : "Uneseno korisničko ime se već koristi!", username : username});
					}
				});
	}else {
		return res.render("pages/register",{layout: "layout",message : "Molimo unesite vrijednosti u sva tražena polja!", username : username});
	}
});

/*
ROUTE: /auth/login
*/
router.get("/login", function (req,res){
	if (req.user) {
		res.redirect("/index/1");
	}else {
	res.locals.title = "Feeddit - Prijava";
	res.locals.message = req.flash('error_msg');
	return res.render("pages/login",{layout: "layout"});
	}
});




/*
PASSPORT strategy
*/
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
   	User.getUserByUsername(username, function(err, user){
    	if (err) {
            return res.status(500).json({ error: true});
        }
   	if(!user){
   		return done(null, false, {message: 'Korisnik sa unesenim korisničkim imenom ne postoji!'});
   	}
   	User.comparePassword(password, user.password, function(err, isMatch){
    	if (err) {
            return res.status(500).json({ error: true});
        }
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Pogrešna lozinka!'});
   		}
   	});
   });
  }));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

/*
ROUTE: /auth/login
*/
router.post('/login',
  passport.authenticate('local', {successRedirect:'/index/1', failureRedirect:'/auth/login',failureFlash: true}),
  function(req, res) {
    return res.redirect('/');
});


/*
ROUTE: /auth/logout
*/
router.get('/logout', function(req, res){
	res.locals.title = "Feeddit - Odjava";
	req.logout();
	return res.redirect('/auth/login');
});




module.exports = router;