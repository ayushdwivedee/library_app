const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    roles:{type:[String],enm:["CREATOR","VIEWER","VIEW_ALL"],default:["VIEW_ALL"],required:true}
},{versionKey:false})

const userModel=mongoose.model("User",userSchema)

module.exports=userModel