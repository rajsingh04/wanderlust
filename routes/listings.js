const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/expressError.js");
const {listingSchema} = require("../utilities/listingSchema.js");
const {isLoggedIn, isOwner} = require("./middleware.js");
const listingController = require("../controllers/listing.js"); 
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer ({storage});

const validateSchema =  (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400, error);   
    } else {
        next();
    }
 }
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,upload.single("listing[image]"),
    wrapAsync(listingController.createPost)
);
//new route
router.get("/new",isLoggedIn,listingController.newForm);

router
.route("/:id")
.put(
    isLoggedIn,isOwner, 
    upload.single("listing[image]"), 
    wrapAsync(listingController.update))
.get(wrapAsync(listingController.show))
.delete(
    isLoggedIn,isOwner,
    wrapAsync(listingController.destroylisting));

//edit route 
router.get("/:id/edits",
    isLoggedIn, isOwner,
    wrapAsync(listingController.editForm));

module.exports = router;