import app from './src/app.js';
import dotenv from 'dotenv';
import ConnectDB from './src/db.js';

dotenv.config();

const PORT = process.env.PORT

ConnectDB();

app.get('/',(req,res)=>{
  res.send("working")

});

app.listen(PORT,()=>[
  console.log(`Server is running on port ${PORT}`)
])