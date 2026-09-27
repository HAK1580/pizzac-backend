const mongoose=require("mongoose");
const dealsSchema= new mongoose.Schema({
    name:String,
    price:Number,
    desc:String,
    category:String,

})
const deals=mongoose.model("best_deals",dealsSchema);

module.exports=deals