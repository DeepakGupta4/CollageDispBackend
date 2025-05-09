const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    
    name:{
        type:String,
    },
    quantity:{
        type:String,
    },
    usage:{
        type:String,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }

},{timestamps:true});

const medicineModel = mongoose.model("medicine",medicineSchema);

module.exports = medicineModel;