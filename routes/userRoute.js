const express=require('express');
const route=express.Router();
const {registerUser,loginUser}=require("../controllers/userController")

route.post('/sign-up',registerUser)
route.post('/sign-in',loginUser)





module.exports=route;
