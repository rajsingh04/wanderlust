const Listing = require("../models/listing");
 
module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.newForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.editForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/edit.ejs",{listing});
}

module.exports.update = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.imge = {url,filename};
    await listing.save();
    }
    req.flash("success"," listing UPDATE successfully !");
    res.redirect(`/listings/${id}`);
}

module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"review",
        populate: {path:"author"}}
    ).populate("owner");
    if(!listing){
        req.flash("error","Your requested listing DOESN'T exist ");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createPost = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing ADDED !");
    res.redirect(`/listings`);  
}

module.exports.destroylisting = async(req,res)=>{
    let {id} = req.params;
     listing = await Listing.findByIdAndDelete(id);
     if(!listing){
        req.flash("error","Your requested listing DOESN'T exist ");
        res.redirect("/listings");
    }
    req.flash("success","Listing DELETED !");
    res.redirect("/listings");
}