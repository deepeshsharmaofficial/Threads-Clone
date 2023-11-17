import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if(!token) {
      return res.status(401).json({message: "Unauthorized"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select("-password"); // return except password

    req.user = user;

    next();

  } catch (err) {
    res.status(500).json({message: err.message});
    console.log("Error in followUnFollowUser: ", err.message);
  }
}

export default protectRoutes;