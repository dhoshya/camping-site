const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


var campgrounds = [
  {
    name: "Lakeside Woodfire Camp",
    image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104490f4c07da1e5b7b0_340.jpg"
  },
  {
    name: "Mountain Skyline View",
    image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"
  },
  {
    name: "Appalacian Hikes",
    image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f4c07da1e5b7b0_340.jpg"
  },
  {
    name: "Shenandoah Drive",
    image: "https://farm9.staticflickr.com/8041/7930201874_6c17ed670a.jpg"
  },
  {
    name: "Chutiya Campsite",
    image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"
  }
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req,res) => {
  res.render("campgrounds", {campgrounds:campgrounds});
});


app.post("/campgrounds", (req,res) => {

    let name = req.body.name;
    let imageUrl = req.body.image;
    let newCampground = {
      name: name,
      image: imageUrl
    }
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");

});

app.get("/campgrounds/new", (req,res)=>{
  res.render("new");
});

app.listen(port, ()=> {
  console.log("Yelp camp server has started.")
});
