require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB=require("./config/db")
const authRoutes=require('./routes/authRouter')

const app = express();
connectDB();

app.use(cors());

app.use(express.json());

app.use('/api/auth',authRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});