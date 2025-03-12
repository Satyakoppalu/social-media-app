const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const router=express.Router();


//Signup Route
router.post('/signup', async (req, res)=>{
    const {username, email, password}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if (existingUser) return res.status(400).json({message:'User already exists'});

        const newUser=new User({username, email, password});
        await newUser.save();
        const token=jwt.sign({id:newUser._id}, process.env.JWT_SECRET,{expiresIn:'1h'});
        
        res.status(201).json({message:'User sucessfully created', token});
    } 
    catch(error){
        res.status(500).json({message:'Server error', error});
    }

}
);

//Login Route
router.post('/login', async(req, res) =>{
    const {email, password}=req.body;
    try{
        const user=await User.findOne({email});
        if (!user) return res.status(400).json({message:'User not found'});

        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:'Invalid credentials'});

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({message:'Login successful', token});
    } 
    catch(error){
        res.status(500).json({message:'Server error', error});
    }

}
);

module.exports=router;