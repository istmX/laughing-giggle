import jwt from 'jsonwebtoken';
import Blacklist from './blacklist.model.js';
import User from './auth.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

   
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
