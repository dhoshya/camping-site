const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground)=> {
          if (err || !foundCampground) {
            req.flash("error", "Campground not found in the database");
            res.redirect("/campgrounds");
          } else {
            if (foundCampground.author.id.equals(req.user._id)) {
              next();
            } else {
              req.flash("error", "You do not have the permission to do that");
              res.redirect("/campgrounds/" + req.params.id);
            }
          }
        });
    } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("/campgrounds/" + req.params.id);
  }
}

middlewareObj.checkCommentOwnership = function (req, res,next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("/campgrounds/" + req.params.id);
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that");
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/campgrounds/" + req.params.id)
  }
}

middlewareObj.isLoggedIn = function (req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
}

module.exports =  middlewareObj;
