const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema =new Schema( 
    {
        title:{
            type:String,
            required:true,
            },
        description:{
            type:String,
        },

        image:{
            
            // type:String,
            filename: String,
            url: String,

            // default:"https://unsplash.com/photos/black-asphalt-road-during-sunset-Xbuh4E5478M",
            // set:(v) => v ===""? "https://unsplash.com/photos/black-asphalt-road-during-sunset-Xbuh4E5478M" :v,
        },
        price:Number,
        location:String,
        country:String,

        reviews:[
            {
                type : Schema.Types.ObjectId,
                ref: 'Review'
                
            }
        ]
    }
);

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing;
