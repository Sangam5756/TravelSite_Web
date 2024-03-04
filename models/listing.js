const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        country:String
    }
)

const Listing = mongoose.model("Listing",listingSchema);
module.exports =Listing;
