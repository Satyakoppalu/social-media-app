const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');
const userRoutes=require('./routes/userRoutes');
const postRoutes=require('./routes/postRoutes');
const followRoutes=require('./routes/followRoutes');



dotenv.config();
const app=express();


app.use(express.json());
app.use(cors({origin:true, credentials:true}));
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/follow', followRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Database connection error:', err));


app.get('/', (req, res) => {
    res.send('Social Media App Backend')
});




const PORT=process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
