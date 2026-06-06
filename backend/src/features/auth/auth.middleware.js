import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Blacklist from './blacklist.model.js';
import User from './auth.model.js';

// Helper to extract and verify token and get user
const verifyTokenAndGetUser = async (req) => {
    let token = req.cookies.token;

    if (req.headers.authorization) {
        const match = req.headers.authorization.match(/^Bearer\s+(.+)$/i);
        if (match) {
            token = match[1];
        }
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is blacklisted (using hash)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const isBlacklisted = await Blacklist.findOne({ tokenHash });
    if (isBlacklisted) return null;
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return null;

    return user;
};

export const authMiddleware = async (req, res, next) => {
    try {
        const user = await verifyTokenAndGetUser(req);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: No token or invalid user" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export const isLoggedIn = async (req, res, next) => {
    try {
        const user = await verifyTokenAndGetUser(req);
        req.user = user; // Will be null if not logged in
        next();
    } catch (error) {
        console.error('isLoggedIn middleware error:', error);
        req.user = null;
        next();
    }
};
