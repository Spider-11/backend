const mongoose=require('mongoose');

const bookingSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    pgId:{type:mongoose.Schema.Types.ObjectId,ref:"PG",required:true},
    status:{type:String,enum:["Pending","Approved","Rejected"],default:"Pending"},
});
module.exports=mongoose.model("Booking",bookingSchema); 