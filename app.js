const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./Schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate);


const Listing = require("./models/listing.js");
const { wrap } = require("module");
const { error } = require("console");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(8000, (req, res) => {
    console.log("server  is listening on port 8000");
})

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(res => console.log("connected to db")).catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hii I am Root");
});

// INDEX ROUTE
app.get("/listing", async (req, res) => {
    // Listing.find({}).then((res) => { console.log(res)});
    const allListing = await Listing.find({});
    res.render("index.ejs", { allListing });
});


// NEW ROUTE

// step  1 - render form
app.get("/listing/new", (req, res) => {
    res.render("new.ejs");
});

const validateListing = (req,res, next)=>{
    let {error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


// step 2 extract data of post request
app.post("/listing", validateListing, wrapAsync( async (req, res,next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");

}));


// SHOW ROUTE
app.get("/listing/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render("show.ejs", { list });

}));

// EDIT Route
app.get("/listing/:id/edit",wrapAsync( async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    res.render("edit.ejs", { list });
}));

// Update Route
app.put("/listing/:id", validateListing, wrapAsync( async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(list);
    res.redirect(`/listing/${id}`);
}));

app.delete("/listing/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    console.log(list);
    res.redirect("/listing");
}));

app.all("*",(req, res, next) =>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    // res.status(statusCode).render("error.ejs", { err });
    res.status(statusCode).render("error.ejs",{err});
});
