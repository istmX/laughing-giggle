import User from './auth.model.js';
import { verifyFirebaseToken } from './auth.service.js';

/* Helper to extract and verify token and get user */
const verifyTokenAndGetUser = async (req) => {
    let token;

    if (req.headers.authorization) {
        const match = req.headers.authorization.match(/^Bearer\s+(.+)$/i);
        if (match) {
            token = match[1];
        }
    }

    if (!token) return null;

    try {
        const { email } = await verifyFirebaseToken(token);
        const user = await User.findOne({ email }).select('-password');
        if (!user) return null;

        return user;
    } catch (error) {
        return null;
    }
};

export const authMiddleware = async (req, res, next) => {
    try {
        const user = await verifyTokenAndGetUser(req);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: No token or invalid user" });
        }

        req.user = user;
        
        // Asynchronously update last active status if it's been more than 5 minutes to avoid DB spam
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (!user.lastActiveAt || user.lastActiveAt < fiveMinutesAgo) {
            User.updateOne({ _id: user._id }, { $set: { lastActiveAt: new Date() } }).exec().catch(err => console.error('Failed to update lastActiveAt', err));
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export const isLoggedIn = async (req, res, next) => {
    try {
        const user = await verifyTokenAndGetUser(req);
        req.user = user; /* Will be null if not logged in */
        
        if (user) {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            if (!user.lastActiveAt || user.lastActiveAt < fiveMinutesAgo) {
                User.updateOne({ _id: user._id }, { $set: { lastActiveAt: new Date() } }).exec().catch(err => console.error('Failed to update lastActiveAt', err));
            }
        }
        
        next();
    } catch (error) {
        console.error('isLoggedIn middleware error:', error);
        req.user = null;
        next();
    }
};
