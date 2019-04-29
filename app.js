const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      port = 3000,
      mongoose = require('mongoose'),
      Campground = require('./models/campgrounds'),
      seedDB = require('./seeds'),
      Comment = require('./models/comment'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      methodOverride = require('method-override'),
      flash = require('connect-flash'),
      User = require('./models/user');

// REQUIRE ROUTES
const commentRoutes = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(flash());
// seedDB(); // seed the database

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: "rohan is the best",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user,
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(port, ()=> {
  //console.log('The value of PORT is:', process.env.PORT);
  console.log("Yelp camp server has started.")
});
