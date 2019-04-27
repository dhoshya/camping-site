const express = require('express');
const router = express.Router();
const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');

// INDEX - show all campgrounds
router.get("/", (req,res) => {

  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
  });
});

// CREATE - create new campground
router.post("/",isLoggedIn,(req,res) => {

    let name = req.body.name;
    let imageUrl = req.body.image;
    let desc = req.body.description;
    let author = {
      id: req.user._id,
      username: req.user.username
    }
    let newCampground = {
      name: name,
      image: imageUrl,
      description: desc,
      author: author
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
router.get("/new", isLoggedIn,(req,res)=>{
  res.render("campgrounds/new");
});

// SHOW - shows more information about selected campground
router.get("/:id", (req,res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(foundCampground);
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

// EDIT CAMPGROUND
router.get("/:id/edit", (req,res) => {
  Campground.findById(req.params.id, (err, foundCampground)=> {
    if (err) {
      res.redirect("/campgrounds")
    } else {
      res.render("campgrounds/edit",{campground: foundCampground});

    }
  })
});


// UPDATE CAMPGROUND
router.put("/:id", (req,res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground,
    (err,updatedCampground) => {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
});

// DESTROY ROUTE
router.delete("/:id",(req,res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  })
});

// MIDDLEWARE
function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
