const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');

const middleareObj = {};

middleareObj.checkCampgroundOwnership = function(req,res,next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground)=> {
          if (err) {
            res.redirect("back");
          } else {
            if (foundCampground.author.id.equals(req.user._id)) {
              next();
            } else {
              res.redirect("back");
            }
          }
        });
    } else {
      res.redirect("back");
  }
}

middleareObj.checkCommentOwnership = function (req, res,next) {
  if (isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back")
  }
}

middleareObj.isLoggedIn = function (req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.export =  middleareObj;
