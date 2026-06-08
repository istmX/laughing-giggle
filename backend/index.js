import 'dotenv/config';
import app from './src/app.js';

import ConnectDB from './src/config/db.js';



const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await ConnectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.send("working")
});

startServer();