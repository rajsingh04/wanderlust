const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReveiw = async(req,res)=>{
    let newListing = await Listing.findById(req.params.id);
     let review = new Review(req.body.review);
        review.author = req.user._id;
     newListing.review.push(review); 
     await review.save();
     await newListing.save();
     req.flash("success","Review ADDED!");
     res.redirect(`/listings/${newListing._id}`);
    }

    module.exports.destroyReview = async(req,res)=>{
        let{id,reviewId} = req.params;
         await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
         await Review.findByIdAndDelete(reviewId);
         req.flash("success","Review DELETED !");
        res.redirect(`/listings/${id}`);
}