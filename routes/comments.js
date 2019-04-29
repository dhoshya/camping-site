const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');
const middlewareObj = require('../middleware');

// COMMENTS NEW
router.get("/new", middlewareObj.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      console.log(err);
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      res.render("comments/new",{campground: foundCampground});
    }
  });
});

// COMMENTS CREATE
router.post("/", middlewareObj.isLoggedIn, (req,res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err || !campground) {
      console.log(err);
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err,comment) => {
        if (err) {
          req.flash("error", "Something went wrong..");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added the comment");
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// EDIT COMMENTS
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership,(req,res) => {
  Campground.findById(req.params.id, (err, foundCampground)=>{
    if (err || !foundCampground) {
      req.flash("error", "Campground not found");
      res.redirect("back");
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        console.log(req.params.comment_id);
        req.flash("error", "Comment not found");
        res.redirect("/campgrounds/show");
      } else {
        console.log(req.params.comment_id);
        res.render("comments/edit",
                  {
                    campground_id: req.params.id,
                    comment: foundComment
                  });
      }
    });
  });
});

// UPDATE COMMENT
router.put("/:comment_id", middlewareObj.checkCommentOwnership,(req,res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,
                  (err, updatedComment) => {
                    if (err) {
                      req.flash("error", "Comment not found");
                      console.log(err);
                      res.redirect("comments/edit");
                    } else {
                      req.flash("success", "Comment updated successfully");
                      res.redirect("/campgrounds/" + req.params.id);
                    }
                  });
});

// DELETE COMMENT
router.delete("/:comment_id", middlewareObj.checkCommentOwnership,(req,res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      req.flash("error", "Oops.. something went wrong");
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted successfully");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
