const mongoose=require('mongoose');

const postSchema =new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:false
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Post=mongoose.model('Post', postSchema);
module.exports=Post