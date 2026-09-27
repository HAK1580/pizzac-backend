const user = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
require('dotenv').config();
const registerUser = (async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);
        const new_user = await user.create({ name, email, password: hashed_password });
        res.status(200).json({ message: "New user registered", new_user })

    } catch (err) {
        res.status(400).json({ message: "server error", err })
    }

});


const loginUser = (async (req, res) => {
    const { email, password } = req.body;
    try {

        const existing_user = await user.findOne({ email });
        
        
        if (!existing_user) {
            return res.status(404).json({ message: "email not registered" });
        }
        const matchpassword = await bcrypt.compare(password, existing_user.password)
        if (!matchpassword) {
            return res.status(404).json({ message: "passwords do not match" });
        }
        
        const userid = existing_user.id || existing_user._id;
        
         const token= jwt.sign(
             {user_info:{id:userid, email:existing_user.email, name:existing_user.name}},
             process.env.JWT_SECRET_KEY,
             {expiresIn:"2d"}

            ) 
        

        res.status(200).json({ message: "login successfull",token})

    }

    catch (err) {
        res.status(400).json({ message: "server error" })
    }


})

module.exports = { registerUser, loginUser }