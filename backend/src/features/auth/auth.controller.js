import mongoose from 'mongoose';
import User from './auth.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = async (req,res)=> {
 try {
    const {name ,username,email,password} =req.body;

    if(!name || !username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    const existingUser = await User.findOne({email})
    if (existingUser) {
        return res.status(400).json({message:"User already exists with this email"});
    }

    const existingUsername = await User.findOne({username})

    if(existingUsername){
        return res.status(400).json({message:"Username already taken"});
    }


    const hashedPassword = await bcrypt.hash(password,12);
  
    //jwt 
    const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'})

    //cookies
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })


    const newUser = new User({
        id: new mongoose.Types.ObjectId(),
        name,
        username,
        email,
        password:hashedPassword
    })
    await newUser.save();

    res.status(201).json({message:"User registered successfully",userId:newUser._id});
 }
    catch (error) {
    const duplicateKey = error?.keyValue ?? {};
    const duplicateMessage = typeof error?.message === 'string' ? error.message : '';

    if (error?.code === 11000 || error?.name === 'MongoServerError' || error?.name === 'MongoError') {
        if (duplicateKey.email || duplicateMessage.includes('email')) {
            return res.status(400).json({message:"User already exists with this email"});
        }

        if (duplicateKey.username || duplicateMessage.includes('username')) {
            return res.status(400).json({message:"Username already taken"});
        }
    }

    console.error('Error registering user:', error);
    res.status(500).json({message:"Server error"});
    }
}



export const LoginUser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        if (!email || !password) {
            return res.status(400).json({message:"Email and password are required"});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message:"Invalid email or password"});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid email or password"});
        }

        //jwt 
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'})

        //cookies
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict',
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({message:"Login successful",userId:user._id});

    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({message:"Server error"});
    }
}