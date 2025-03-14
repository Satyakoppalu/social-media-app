const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true

        },
        email:{
            type:String,
            required:true,
            unique:true

        },
        password:{
            type:String,
            required:true
        },
        profileImageUrl:{
            type:String,
            required:false
        },
        following:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }],
        followers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'

        }]

    }
);

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password, 10);
    next();
});

const User=mongoose.model('User', userSchema);
module.exports=User;