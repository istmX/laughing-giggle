import User from './auth/auth.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookies from 'cookie-parser'



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
    const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIN:7*24*60*60*1000})

    //cookies
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })


    const newUser = new User({
        name,
        username,
        email,
        password:hashedPassword
    })
    await newUser.save();

    res.status(201).json({message:"User registered successfully",token});
 }
    catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({message:"Server error"});
    }
}