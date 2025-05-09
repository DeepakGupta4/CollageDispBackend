const mongoose = require("mongoose");

const faciltySchema = new mongoose.Schema({
    
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }

},{timestamps:true});

const facilityModel = mongoose.model("facility",faciltySchema);

module.exports = facilityModel;