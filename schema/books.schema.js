const mongoose=require("mongoose");

const bookSchema=mongoose.Schema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false})

const bookModel=mongoose.model("Book",bookSchema)

module.exports=bookModel