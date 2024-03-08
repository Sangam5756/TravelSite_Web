const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res, next)=>{
    let {error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


// INDEX ROUTE
router.get("/", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("index.ejs", { allListing });
});



// NEW ROUTE
// step  1 - render form
router.get("/new", (req, res) => {
    res.render("new.ejs");
});
// step 2 extract data of post request
router.post("/", validateListing, wrapAsync( async (req, res,next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");

}));


// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");
    res.render("show.ejs", { list });

}));

// EDIT Route
router.get("/:id/edit",wrapAsync( async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render("edit.ejs", { list });
}));

// Update Route
router.put("/:id", validateListing, wrapAsync( async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(list);
    res.redirect(`/listing/${id}`);
}));


// Delete Route
router.delete("/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    console.log(list);
    res.redirect("/listing");
}));


module.exports = router;