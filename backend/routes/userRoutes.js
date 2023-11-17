import express from "express";
import { followUnFollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from "../controller/userController.js";
import protectRoutes from "../middlewares/protectRoutes.js";

const router = express.Router();

// router.get("/signup", (req, res) => {
//   res.send("Signed up successfully");
// });

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoutes, followUnFollowUser); // Toggle state (follow / unfollow)
router.post("/update/:id", protectRoutes, updateUser);
router.get("/profile/:username", getUserProfile);

export default router;