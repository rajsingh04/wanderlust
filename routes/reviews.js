const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const {listingSchema, reviewSchema} = require("../utilities/listingSchema.js");
const Review = require("../models/review.js");
const {isLoggedIn, isReviewAuthor} = require("./middleware.js");
const reviewController = require("../controllers/review.js");

const validateReview =  (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400, error);   
    } else {
        next();
    }
 }

//reviews route
router.post("/",
    isLoggedIn,validateReview,
    wrapAsync(reviewController.createReveiw));

//delete review route
router.delete("/:reviewId",
    isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router;