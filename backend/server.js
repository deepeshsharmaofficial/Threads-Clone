import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import {v2 as cloudinary} from 'cloudinary';

dotenv.config()

connectDB();

const app = express();

const PORT = process.env.PORT;

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET 
});

// Middlewares
app.use(express.json({limit: '50mb'})); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // To parse form data in the req.body
app.use(cookieParser()); // get the cookie from request and set the cookie in response

// app.use("/", (req, res) => {
//   res.send("dfefef");
// });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
})
