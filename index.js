const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');


const app = express();
dotenv.config()
connectDB();

app.use(cors({
    origin: '*'
}));
app.use(express.json({ extended: true }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/',(req,res)=>{
    res.send("Hello World")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
