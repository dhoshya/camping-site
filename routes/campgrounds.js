const express = require('express');
const router = express.Router();
const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');
const middlewareObj = require('../middleware');


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
router.post("/",middlewareObj.isLoggedIn,(req,res) => {

    let name = req.body.name;
    let imageUrl = req.body.image;
    let desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newCampground = {
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
router.get("/new", middlewareObj.isLoggedIn,(req,res)=>{
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
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership,(req,res) => {
  Campground.findById(req.params.id, (err, foundCampground)=> {
    res.render("campgrounds/edit",{campground: foundCampground});
  });
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
router.delete("/:id",middlewareObj.checkCampgroundOwnership, (req,res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  })
});

module.exports = router;
