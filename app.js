const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./Schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const listing = require("./routes/listing.js");

// const { wrap } = require("module");
// const { error } = require("console");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
};
main().then(res => console.log("connected to db")).catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", (req, res) => {
    res.send("Hii I am Root");
});



const validatereview = (req,res, next)=>{
    let {error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

app.use("/listing",listing);

// Reviews
// post route
app.post("/listing/:id/reviews",validatereview,wrapAsync(async  (req, res) =>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    let newReview  = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("newReview saved");
    res.redirect(`/listing/${id}`);

}));

// DELETE REVIEW
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`); // Add a leading slash before "listing"
}));


app.all("*",(req, res, next) =>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    // res.status(statusCode).render("error.ejs", { err });
    res.status(statusCode).render("error.ejs",{err});
});


app.listen(8000, (req, res) => {
    console.log("server  is listening on port 8000");
})