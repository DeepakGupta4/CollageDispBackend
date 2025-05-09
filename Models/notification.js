const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    
    title:{
        type:String,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }

},{timestamps:true});

const notificationModel = mongoose.model("notification",NotificationSchema);

module.exports = notificationModel;