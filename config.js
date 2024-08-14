const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config()
const url=process.env.MONGO_URL
const connectToDB=async()=>{
    try {
        await mongoose.connect(url)
         console.log(` Connected to db `)
    } catch (error) {
        console.log(`error while connecting to db ${error}`)
    }
}

module.exports=connectToDB