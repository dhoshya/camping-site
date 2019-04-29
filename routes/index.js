const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


// ROOT
router.get("/", (req, res) => {
  res.render("landing");
});


// REGISTER ROUTE
router.get("/register", (req,res)=>{
  res.render("register");
});


// REGISTER LOGIC ROUTE
router.post("/register", (req,res) => {

  let newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.render("register");
    }
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to YelpCamp" + user.username);
        res.redirect("/campgrounds");
      });
    });
});

// LOGIN ROUTE
router.get("/login", (req,res)=>{
  res.render("login");
});

// LOGIN LOGIC ROUTE
router.post("/login", passport.authenticate("local",
        {
          successRedirect:"/campgrounds",
          failureRedirect:"/login"
        }), (req,res) =>
{});

// LOGOUT ROUTE
router.get("/logout", (req,res) => {
  req.logout();
  req.flash("success", "Successfully logged you out");
  res.redirect("/campgrounds");
});

// MIDDLEWARE
function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
