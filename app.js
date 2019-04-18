const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');
const seedDB = require('./seeds');

seedDB();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

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
      res.render("index", {campgrounds:allCampgrounds});
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
  res.render("new");
});

// SHOW - shows more information about selected campground
app.get("/campgrounds/:id", (req,res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(foundCampground);
      res.render("show",{campground: foundCampground});
    }
  });
});


app.listen(port, ()=> {
  //console.log('The value of PORT is:', process.env.PORT);
  console.log("Yelp camp server has started.")
});
