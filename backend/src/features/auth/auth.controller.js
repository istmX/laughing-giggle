import mongoose from 'mongoose';
import crypto from 'crypto';
import User from './auth.model.js';
import Blacklist from './blacklist.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = async (req,res)=> {
 try {
    const {name ,username,email,password} =req.body;

    if(!name || !username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
     const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({message:"Invalid email format"});
    }

    const existingUser = await User.findOne({email})
    if (existingUser) {
        return res.status(400).json({message:"User already exists with this email"});
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({message:"Username can only contain letters, numbers, and underscores"});
    }
    const existingUsername = await User.findOne({username})


    if(existingUsername){
        return res.status(400).json({message:"Username already taken"});
    }


    const hashedPassword = await bcrypt.hash(password,12);
  
    const newUser = new User({
        name,
        username,
        email,
        password:hashedPassword
    })
    await newUser.save();

    //jwt 
    const token = jwt.sign({email, id: newUser._id},process.env.JWT_SECRET,{expiresIn:'7d'})

    //cookies
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })

    res.status(201).json({
        message:"User registered successfully",
        userId:newUser._id,
        token: `Bearer ${token}`
    });
 }
    catch (error) {
    if (error?.code === 11000 || (error?.keyValue && Object.keys(error?.keyValue).length > 0)) {
        const duplicateKey = error.keyValue || {};
        if (duplicateKey.email) {
            return res.status(400).json({message:"User already exists with this email"});
        }

        if (duplicateKey.username) {
            return res.status(400).json({message:"Username already taken"});
        }
    }

    console.error('Error registering user:', error);
    res.status(500).json({message:"Server error"});
    }
}



export const loginUser = async (req,res)=>{
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
        const token = jwt.sign({email, id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        //cookies
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict',
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({
            message:"Login successful",
            userId:user._id,
            token: `Bearer ${token}`
        });

    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({message:"Server error"});
    }
}



export const logoutUser = async (req,res)=>{
    try {
        let token = req.cookies.token;

        if (req.headers.authorization) {
            const match = req.headers.authorization.match(/^Bearer\s+(.+)$/i);
            if (match) {
                token = match[1];
            }
        }

        if (token) {
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            await Blacklist.findOneAndUpdate(
                { tokenHash },
                { tokenHash },
                { upsert: true, returnDocument: 'after' }
            );
        }

        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict',
        })
        res.status(200).json({message:"Logout successful"});
    }
    catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({message:"Server error"});
    }
}





export const getMe = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                joinedAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: "Server error" });
    }
};
