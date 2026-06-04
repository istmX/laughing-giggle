import mongoose from 'mongoose';

const ConnectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not set in environment');
        }
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to DB');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        throw error;
    }
};

export default ConnectDB;