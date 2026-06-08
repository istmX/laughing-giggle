import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import ConnectDB from './src/config/db.js';
import { initSocket } from './src/config/socket.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
    try {
        await ConnectDB();
        
        /* Initialize Socket.io */
        initSocket(server);

        server.listen(PORT, () => {
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