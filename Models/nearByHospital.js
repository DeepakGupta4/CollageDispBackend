const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    
    name:{
        type:String,
    },
    address:{
        type:String,
    },
    contact:{
        type:String,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }

},{timestamps:true});

const hospitalModel = mongoose.model("hospital",hospitalSchema);

module.exports = hospitalModel;