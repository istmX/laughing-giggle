import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
    tokenHash: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60, /* 7 days - same as JWT expiry */
    },
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

export default Blacklist;
