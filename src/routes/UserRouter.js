import express from "express";
import UserController from "../controllers/UserController.js";
import {
  authMiddleware,
  authUserMiddleware,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.loginUser);
router.post("/log-out", UserController.logoutUser);
router.get("/getAllUser", UserController.getAllUser);
router.get(
  "/getDetailUser/:id",
  authUserMiddleware,
  UserController.getDetailUser
);
router.put("/update-user/:id", UserController.updateUser);
router.delete("/delete-user/:id", authMiddleware, UserController.deleteUser);
router.post("/delete-many", authMiddleware, UserController.deleteManyUser);
router.post("/refresh_token", UserController.refreshToken);

export default router;
