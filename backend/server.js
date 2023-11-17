import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config()

connectDB();

const app = express();

const PORT = process.env.PORT;

// Middlewares
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
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
