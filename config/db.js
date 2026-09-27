const mongoose=require("mongoose")

async function connectdb(){
    try{
        await mongoose.connect("mongodb://localhost:27017/pizzac") 
       console.log("db connected successfully!")
    }catch(err){
        console.log(err)
    }
}


module.exports=connectdb
