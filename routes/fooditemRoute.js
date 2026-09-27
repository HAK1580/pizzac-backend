const express=require("express");
const route=express.Router();
const {createfood,getdeals,getfooditems}=require("../controllers/fooditemController")

route.post('/',createfood)
route.get('/deals',getdeals)
route.get('/',getfooditems)

module.exports=route;