import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from 'cloudinary';
import mongoose from "mongoose";

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{email}, {username}]});
    
    if(user) {
      return res.status(400).json({error: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if(newUser) {

      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      })
    } else {
      res.status(400).json({error: "Invalid user data"});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in signupUser: ", err.message);
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
    console.log('isPasswordCorrect: ', isPasswordCorrect);

    if(!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
    
  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in signupUser: ", err.message);
  }
}

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in signout: ", err.message);
  }
}

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const protectedcurrentUserId = (req.user._id).toString(); // req.user is coming from protectedRoutes.js
    /*
    req.user._id:  new ObjectId('65531aac30f19575bff3fdbc') // It is object. we need to convert it into string
    req.user._id.toString():  65531aac30f19575bff3fdbc
    */

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(protectedcurrentUserId);

    if(id === protectedcurrentUserId) {
      return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
    }

    if(!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found"});
    }

    const isFollowing = currentUser.following.includes(id);

    if(isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: protectedcurrentUserId } });
      await User.findByIdAndUpdate(protectedcurrentUserId, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully "});
    } else {
      // follow user
      await User.findByIdAndUpdate(id, { $push: { followers: protectedcurrentUserId } });
      await User.findByIdAndUpdate(protectedcurrentUserId, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully "});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in followUnFollowUser: ", err.message);
  }

}

const updateUser = async (req, res) => {
  const { name, email, username, password , bio } = req.body;
  let { profilePic } = req.body;

  const protectedcurrentUserId = (req.user._id).toString(); // req.user is coming from protectedRoutes.js

  if (req.params.id !== protectedcurrentUserId) {
    return res.status(400).json({error: "You cannot update other user's profile"});

  }
  try {
    let user = await User.findById(protectedcurrentUserId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if(password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Cloudinary
    if(profilePic) {
      if(user.profilePic) {
        await cloudinary.uploader.destroy(user.profilePic.split(`/`).pop().split('.')[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    // password should be null in response, otherwise I will be accessable in frontendside
    user.password = null;

    // TODO: hide createdAt, updatedAt, password, _v should be hide from local storage
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in updateUser: ", err.message);
  }
}

const getUserProfile =  async (req, res) => {
  // We will fetch user profile either with username or userId
	// query is either username or userId
  const { query } = req.params;

  try {
    let user;
    // if query id userId
    if(mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id:query }).select("-password").select("-updatedAt");
    } else {
      // if query is username
      user = await User.findOne({ username:query }).select("-password").select("-updatedAt");
    }

    if (!user) {
      return res.status(404).json({error: "User not found"})
    }

    return res.status(200).json(user);

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in getUserProfile: ", err.message);
  }
}

export { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile };