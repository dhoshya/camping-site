const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campgrounds');
const Comment = require('../models/comment');
const middleareObj = require('../middleware');

// COMMENTS NEW
router.get("/new", middleareObj.isLoggedIn, (req,res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new",{campground: foundCampground});
    }
  });
});

// COMMENTS CREATE
router.post("/", middleareObj.isLoggedIn, (req,res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err,comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// EDIT COMMENTS
router.get("/:comment_id/edit", middleareObj.checkCommentOwnership,(req,res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log(req.params.comment_id);
      res.redirect("back");
    } else {
      res.render("comments/edit",
                {
                  campground_id: req.params.id,
                  comment: foundComment
                });
    }
  });
});

// UPDATE COMMENT
router.put("/:comment_id", middleareObj.checkCommentOwnership,(req,res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,
                  (err, updatedComment) => {
                    if (err) {
                      console.log(err);
                      res.redirect("back");
                    } else {
                      res.redirect("/campgrounds/" + req.params.id);
                    }
                  });
});

// DELETE COMMENT
router.delete("/:comment_id", middleareObj.checkCommentOwnership,(req,res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
