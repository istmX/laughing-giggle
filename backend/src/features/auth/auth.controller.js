import mongoose from 'mongoose';
import User from './auth.model.js';
import { verifyFirebaseToken } from './auth.service.js';

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  provider: user.provider,
  avatar: user.avatar,
  pfpUrl: user.pfpUrl,
  joinedAt: user.createdAt,
});

export const registerUser = async (req,res)=> {
 try {
    const {token, name ,username} =req.body;

    if(!token || !name || !username){
        return res.status(400).json({message:"All fields are required"});
    }

    const { email, googleId } = await verifyFirebaseToken(token);

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

    const newUser = new User({
        name,
        username,
        email,
        googleId,
        provider: 'local'
    })
    await newUser.save();

    res.status(201).json({
        message:"User registered successfully",
        userId:newUser._id,
        user: buildUserResponse(newUser)
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
        const {token} = req.body;
        
        if (!token) {
            return res.status(400).json({message:"Token is required"});
        }

        const { email } = await verifyFirebaseToken(token);

        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message:"User not found"});
        }

        res.status(200).json({
            message:"Login successful",
            userId:user._id,
            user: buildUserResponse(user)
        });

    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({message:"Server error"});
    }
}

export const logoutUser = async (req,res)=>{
    try {
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
            user: buildUserResponse(user)
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: "Server error" });
    }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: 'Google credential is required',
      });
    }

    const payload = await verifyFirebaseToken(credential);

    const { googleId, email, name, picture } = payload;

    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      const baseUsername = email.split('@')[0];
      let username = baseUsername;

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        username = `${baseUsername}_${Date.now()}`;
      }

      user = await User.create({
        name,
        username,
        email,
        googleId,
        provider: 'google',
        avatar: picture,
        pfpUrl: picture,
      });
    }

    return res.status(200).json({
      message: 'Google login successful',
      userId: user._id,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      message: 'Google authentication failed',
    });
  }
};
