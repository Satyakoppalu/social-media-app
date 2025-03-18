const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const router=express.Router();
const upload=require('../config/s3');
const authMiddleware=require('../middleware/authMiddleware');
const Post = require('../models/Post');



router.post('/signup', upload.single('image'),async (req, res)=>{
    const {username, email, password}=req.body;
    const profileImageUrl=req.file? req.file.location:null;
    try{
        const existingUser=await User.findOne({email});
        if (existingUser) return res.status(400).json({message:'User already exists'});

        const newUser=new User({username, email, password, profileImageUrl});
        await newUser.save();
        const token=jwt.sign({id:newUser._id}, process.env.JWT_SECRET,{expiresIn:'1h'});
        
        res.status(201).json({
            message: 'User successfully created',
            token,
            userId: newUser._id, 
        });
    } 
    catch(error){
        res.status(500).json({message:'Server error', error});
    }

}
);


router.post('/login', async(req, res) =>{
    const {email, password}=req.body;
    try{
        const user=await User.findOne({email});
        if (!user) return res.status(400).json({message:'User not found'});

        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:'Invalid credentials'});

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(201).json({
            message: 'User successfully created',
            token,
            userId: user._id, 
        });
    } 
    catch(error){
        res.status(500).json({message:'Server error', error});
    }

}
);


router.put('/update-profile-pic', authMiddleware, upload.single('image'),async (req, res)=>{
    const userId = req.user.id;

    try{
        if (!req.file){
            return res.status(400).json({message:"Please upload a pic"});
        }
        const profileImageUrl=req.file.location

        const updatedUser=await User.findByIdAndUpdate(userId, {profileImageUrl}, {new:true, select:'profileImageUrl'});

        if (!updatedUser){
            return res.status(404).json(({message:"User not found"}));
        }

        res.status(200).json({message:"Profile pic updated successfully", user:updatedUser})
    }
    catch(error){
        res.status(500).json({message:"Error changing profile pic", error})    }
});


router.put('/update-password', authMiddleware, async (req, res)=>{
    const userId = req.user.id;
    const {password}=req.body;
    

    try{
        if (!password){
            return res.status(400).json({message:"Please enter a password"});
        }
        
        const hashedPassword= await bcrypt.hash(password, 10);
        const updatedUser=await User.findByIdAndUpdate(userId, {password:hashedPassword}, { new: true });

        if (!updatedUser){
            return res.status(404).json(({message:"User not found"}));
        }

        res.status(200).json({message:"Password updated successfully"})
    }
    catch(error){
        res.status(500).json({message:"Error changing password", error})    }
});


router.delete('/delete-account/', authMiddleware, async(req, res)=>{
    userId=req.user.id

    user=await User.findById(userId)
    
    try{
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        await User.updateMany({following:userId}, {$pull:{following:userId}});
        await User.updateMany({followers:userId}, {$pull:{followers:userId}});
        await Post.deleteMany({user:userId});
        
        await User.findByIdAndDelete(userId);

        res.status(200).json({message:"Account deleted successfully."});
    }catch(error){
        res.status(500).json({message:"Error deleting account", error});

    }
});

router.put('/update-bio', authMiddleware, async(req, res)=>{
    const userId=req.user.id;
    const {bio}=req.body;

    try{
        const updatedUser= await User.findByIdAndUpdate(userId, {bio}, {new:true}).select('bio');
        if (!updatedUser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({ message: "Bio updated successfully", user: updatedUser });
    }
    catch(error){
        res.status(500).json({ message: "Error updating bio", error });
    }
});

router.get('/user/:id', authMiddleware, async (req, res) => {
    const { id } = req.params; 
    const loggedInUserId = req.user.id; 
    
    try {
      const user = await User.findById(id).select('username profileImageUrl bio followers following');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const posts = await Post.find({ user: id })
        .select('text imageUrl likes comments')
        .populate('comments.user', 'username profileImageUrl') // Populate comment user details
        .sort({ createdAt: -1 });

      const isOwner = loggedInUserId.toString() === user._id.toString();
  
      res.status(200).json({
        user,
        posts,
        isOwner,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/search', authMiddleware, async (req, res) => {
    const { query } = req.query;
    try {
      const users = await User.find({
        username: { $regex: query, $options: 'i' }, 
      }).select("username _id");
  
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: "Error searching for users", error });
    }
  });
  


module.exports=router;