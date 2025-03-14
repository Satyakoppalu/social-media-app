const express= require('express');
const Post=require('../models/Post');
const upload=require('../config/s3');
const authMiddleware=require('../middleware/authMiddleware');
const router=express.Router();
const User=require('../models/User');


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



router.post('/like/:postId', authMiddleware, async(req, res)=>{
    const userId=req.user.id;
    const {postId}= req.params;

    try{
        const post= await Post.findById(postId);
        if (!post){
            return res.status(404).json({message: "Post not found."});
        }
        const postOwner=await User.findById(post.user);
        const user =await User.findById(userId);

        if (!user.following.includes(postOwner._id)){
            return res.status(403).json({message:"You can follow posts of user you follow."});

        }
        if (post.likes.includes(userId)){
            return res.status(400).json({message:"You already liked this post."});
        }

        post.likes.push(userId);
        await post.save()

        res.status(200).json({message:"Post liked successfully."});

    }
    catch(error){
        res.status(500).json({message:"Error liking the post.", error});
    }
});






router.post('/unlike/:postId', authMiddleware, async(req, res)=>{
    const userId=req.user.id;
    const {postId}=req.params;

    try{
        const post=await Post.findById(postId);
        if (!post){
            return res.status(400).json({message:"Post not found."});
        }
        if (!post.likes.includes(userId)){
            return res.status(400).json({message:"You have not like the post yet."});
        }
        post.likes=post.likes.filter(id=>id.toString()!=userId);
        await post.save();

        res.status(200).json({message:"Post unliked successfully."});
    }catch (error){
        res.status(500).json({message:"Error unliking the post."});
    }

});




router.post('/comment/:postId', authMiddleware, async(req, res)=>{
    const userId=req.user.id;
    const {postId}=req.params;
    const {text}=req.body;

    if (!text){
        return res.status(400).json({message:"Comment cannot be empty."});    
    }

    try{
      const post=await Post.findById(postId);
      if (!post){
        return res.status(404).json({message:"Post not found"});
      }  

      const postOwner= await User.findById(post.user);
      const user= await User.findById(userId);

      if (!user.following.includes(postOwner._id)){
        return res.status(403).json({message:"You can only comment on posts of your friends."});

      }
      const comment={user:userId, text, createdAt:new Date()};
      post.comments.push(comment);
      await post.save();

      res.status(201).json({message: "comment added successfully."});
    }
    catch(error){

        res.status(500).json({message:"Error adding comment", error});
    }
});

router.delete('/comment/:postId/:commentId', authMiddleware, async(req, res)=>{
    const userId=req.user.id;
    const {postId, commentId}=req.params;

    try{
        const post=await Post.findById(postId);
        if (!post){
            return res.status(400).json({message:"post not found."});
        }
        const comment= post.comments.id(commentId)
        if (!comment){
            return res.status(400).json({message:"comment not found."});
        }

        if (comment.user.toString()!=userId){
            return res.status(403).json({message:"You can only delete your own comments."});
            
        }
        post.comments=post.comments.filter(c=>c._id.toString()!==commentId);
        await post.save();
        
        res.status(200).json({message:"Comment deleted successfuly."});
    }catch(error){
        res.status(500).json({message:"Error deleting message", error});
    }

});


router.get('/home', authMiddleware, async(req, res)=>{
    const userId=req.user.id;

    try{
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found."});
        }

        const followingUserIds=user.following;

        const posts= await Post.find({
            user:{$in:followingUserIds}
        })
        .populate('user', 'username')
        .sort({createdAt:-1});

        res.status(200).json({posts});


    }
    catch(error){
        res.status(500).json({message:"Error fetching posts.", error});
    }
});


module.exports=router