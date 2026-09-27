const mongoose=require("mongoose")
require("dotenv").config()

async function connectdb(){
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}`) 
       console.log("db connected successfully!")
    }catch(err){
        console.log(err)
    }
}


module.exports=connectdb
