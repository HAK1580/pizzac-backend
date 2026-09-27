const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
});

const user=mongoose.model("users",userSchema);

module.exports=user