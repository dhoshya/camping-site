const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp");

//schemaSetup

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Lakeside Woodfire Camp",
//     image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"
//   }, function(err, campground){
//     if (err){
//       console.log(err);
//     } else {
//       console.log("Newly created campground");
//       console.log(campground);
//     }
//   });


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

app.get("/campgrounds", (req,res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", {campgrounds:allCampgrounds});
    }
  });
});


app.post("/campgrounds", (req,res) => {

    let name = req.body.name;
    let imageUrl = req.body.image;
    let newCampground = {
      name: name,
      image: imageUrl
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

app.get("/campgrounds/new", (req,res)=>{
  res.render("new");
});

app.listen(port, ()=> {
  console.log("Yelp camp server has started.")
});
