const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); 

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be Login first")
         return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!(res.locals.currUser._id.equals(listing.owner))){
        req.flash("error","you are not the OWNER of listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!(res.locals.currUser._id.equals(review.author))){
        req.flash("error","you are not the Author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}