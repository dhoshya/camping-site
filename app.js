const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

//schemaSetup

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//    name: "Lakeside Woodfire Camp",
//    image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
//    description: "Beautiful lakeside camping for your weekend date."
//  }, (err, campground) => {
//    if (err) {
//      console.log(err);
//    } else {
//      console.log("newly created campground");
//      console.log(campground);
//    }
//  });

// var campgrounds = [
//   {
//     name: "Lakeside Woodfire Camp",
//     image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"
//   },
//   {
//     name: "Mountain Skyline View",
//     image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"
//   },
//   {
//     name: "Appalacian Hikes",
//     image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"
//   },
//   {
//     name: "Shenandoah Drive",
//     image: "https://farm9.staticflickr.com/8041/7930201874_6c17ed670a.jpg"
//   },
//   {
//     name: "Chutiya Campsite",
//     image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"
//   }
// ];

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
  console.log("Yelp camp server has started.")
});
