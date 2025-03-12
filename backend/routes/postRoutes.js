const express= require('express');
const Post=require('../models/Post');
const upload=require('../config/s3');
const authMiddleware=require('../middleware/authMiddleware');
const router=express.Router();


router.post('/create', authMiddleware, upload.single('image'), async(req, res) =>{
    const{text}=req.body
    const imageUrl = req.file? req.file.location:null
    const userId=req.user.id

    try{
        const newPost=new Post({text, imageUrl, user:userId});
        await newPost.save();
        res.status(201).json({message:'Post created successfully', post:newPost});
    }
    catch (error){
        console.error('Error creating post:', error);
        res.status(500).json({message:'Error creating post', error});
    }

}
);

router.get('/', async(req, res)=>{
    try{
        const posts=await Post.find();
        res.status(200).json(posts);
    }
    catch (error){
        res.status(500).json({message:'Error fetching posts', error});
    }
});
module.exports=router