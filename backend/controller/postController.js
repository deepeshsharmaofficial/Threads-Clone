import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary';

const createPost = async (req, res) => {
  try {
    const {postedBy, text} = req.body;
    let {img} = req.body;

    if(!postedBy || !text) {
      return res.status(400).json({error: "Posted by and text fields are required"});
    }

    const user = await User.findById(postedBy);
    if(!user) {
      return res.status(404).json({error: "User not found"});
    }

    // When you are trying to create other user post
    if(user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({error: "Unauthorized to create post"});
    }

    const maxLength = 500;
    if(text.length > maxLength) {
      return res.json(400).json({error: `Text must be less than ${maxLength} characters`})
    }

    if(img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json({message: "Post created successfully", newPost});

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in createPost: ", err.message);
  }
}

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if(!post) {
      return res.status(404).json({error: "post not found"});
    }

    return res.status(200).json({post});

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in getPost: ", err.message);
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) {
      return res.status(404).json({error: "Post not found"});
    }

    if(post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({error: "Unauthorized to delete post"});
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({message: "Post deleted successfully"});

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in deletePost: ", err);
  }
}

const likeUnlikePost = async (req, res) => {
  try {
    const {id:postId} = req.params; // we change name from is to postId
    const userId = req.user._id;  // req.user is coming from protectedRoutes.js

    const post = await Post.findById(postId);
    console.log('post: ', post);
    console.log('post.likes: ', post.likes);

    if(!post) {
      return res.status(404).json({error: "Post not found"});
    }
    const userLikedPost = post.likes.includes(userId);
    console.log('userLikedPost: ', userLikedPost);
    /*
    .includes(userId): This is a method used to check 
    if a given value (in this case, userId) is present in the array post.likes
    It returns a boolean value (true if the userId is found, and false otherwise)
    */

    if(userLikedPost) {
      // post is liked then Unlike the post
      await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
      return res.status(200).json({message: "Post unliked successfully"});
    } else {
      // post is unliked then like the post
      post.likes.push(userId);
      await post.save();
      // await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } }); // This is alternative of above two lines
      return res.status(200).json({message: "Post liked successfully"});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in likeUnlikePost: ", err);
  }
}

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    // const {id:postId} = req.params;
    const postId = req.params.id;
    const userId = req.user._id; // req.user is coming from protectedRoutes.js
    const userProfilePic = req.user.profilePic; // req.user is coming from protectedRoutes.js
    const username = req.user.username; // req.user is coming from protectedRoutes.js

    const post = await Post.findById(postId);

    if(!text) {
      return res.status(400).json({error: "Text field is required"});
    }

    if(!post) {
      return res.status(404).json({error: "Post not found"});
    }

    const reply = {userId, text, userProfilePic, username};

    post.replies.push(reply);
    await post.save();

    res.status(200).json({message: "Reply added successfully", post});    

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in replyToPost: ", err);
  }
}

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).json({error: "User not found"});
    }

    const following = user.following;

    const feedPosts = await Post
                      .find({ postedBy: { $in: following }})
                      .sort({ createdAt: -1});
    
    res.status(200).json(feedPosts);
    
  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Error in getFeedPosts: ", err);
  }
}

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };