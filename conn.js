const mongoose = require("mongoose");


mongoose
  .connect(process.env.MONGO_URI,{
    
    serverSelectionTimeoutMS: 5000,})
  .then(() => console.log('Mongo DB connection successful!')).catch(err=>{
    console.log(err.message)
  });