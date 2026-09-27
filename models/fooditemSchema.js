const mongoose=require("mongoose");
const fooditemSchema= new mongoose.Schema({
    name:String,
    price:Number,
    desc:String,
    category:String,

})
const fooditem=mongoose.model("food_items",fooditemSchema);

module.exports=fooditem