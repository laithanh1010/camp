const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const review = req.body.review;
  const newReview = new Review(review);
  newReview.author = req.user._id;
  await newReview.save();
  const campground = await Campground.findById(id);
  campground.reviews.push(newReview);
  await campground.save();
  req.flash("success", "Create New Review");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Delete Successful");
  res.redirect(`/campgrounds/${id}`);
};
