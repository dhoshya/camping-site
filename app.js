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
      User = require('./models/user')

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
seedDB();

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
// HOME PAGE
app.get("/", (req, res) => {
  res.render("landing");
});

//Index - show all campgrounds
app.get("/campgrounds", (req,res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds:allCampgrounds});
    }
  });
});

// CREATE - create new campground
app.post("/campgrounds", (req,res) => {

    let name = req.body.name;
    let imageUrl = req.body.image;
    let desc = req.body.description
    let newCampground = {
      name: name,
      image: imageUrl,
      description: desc
    }
    //campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated){
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    })
});

// NEW - Show form to create new campground
app.get("/campgrounds/new", (req,res)=>{
  res.render("campgrounds/new");
});

// SHOW - shows more information about selected campground
app.get("/campgrounds/:id", (req,res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

// ============= //
// COMMENT ROUTES
app.get("/campgrounds/:id/comments/new", (req,res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new",{campground: foundCampground});
    }
  });
});

app.post("/campgrounds/:id/comments", (req,res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err,comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// AUTH ROUTES

app.get("/register", (req,res)=>{
  res.render("register");
});

app.post("/register", (req,res) => {

  let newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.render("register");
    }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/campgrounds");
      });
    });
});


app.listen(port, ()=> {
  //console.log('The value of PORT is:', process.env.PORT);
  console.log("Yelp camp server has started.")
});
