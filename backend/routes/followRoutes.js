const express=require('express');
const User=require('../models/User');
const authMiddleware=require('../middleware/authMiddleware');
const router=express.Router();
const mongoose = require('mongoose');



router.post('/follow/:id', authMiddleware, async(req, res)=>{
    const userId=req.user.id;
    const followUserId=req.params.id;


    
    try{
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followUserId)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }
        if (userId===followUserId){
            return res.status(400).json({message:"You cannot follow yourself."});
        }

        const user=await User.findById(userId);
        if (user.following.includes(followUserId)){
            return res.status(400).json({message:"You are already following this user"});

        }


        user.following.push(followUserId);
        await user.save();

        const followUser=await User.findById(followUserId);
        followUser.followers.push(userId);
        await followUser.save();
        res.status(200).json({message:"User followed successfully"});

    } catch (error){
        res.status(500).json({message:"Error following user", error});

    }
});


router.post('/unfollow/:id', authMiddleware, async(req, res)=>{
    const userId=req.user.id;
    const unfollowUserId=req.params.id;

    try{
        const user= await User.findById(userId);
        if (!user.following.includes(unfollowUserId)){
            return res.status(400).json({message:"You are not following this user."});

        }

        user.following.pull(unfollowUserId);
        await user.save();

        const unfollowUser= await User.findById(unfollowUserId);
        unfollowUser.followers.pull(userId);
        await unfollowUser.save();

        res.status(200).json({message:"User unfollowed successfully."});
    }catch(error){
        res.status(500).json({message:"Error unfollowing user", error});
    }

});

module.exports=router;