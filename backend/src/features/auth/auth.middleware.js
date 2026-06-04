import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Blacklist from './blacklist.model.js';
import User from './auth.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (req.headers.authorization) {
            const match = req.headers.authorization.match(/^Bearer\s+(.+)$/i);
            if (match) {
                token = match[1];
            }
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is blacklisted (using hash)
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const isBlacklisted = await Blacklist.findOne({ tokenHash });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
        }
        
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
