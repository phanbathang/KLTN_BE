import express from "express";
import ProductController from "../controllers/ProductController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create-product", ProductController.createProduct);
router.put("/update-product/:id", ProductController.updateProduct);
router.get("/getAllProduct", ProductController.getAllProduct);
router.get("/getDetailProduct/:id", ProductController.getDetailProduct);
router.delete("/delete-product/:id", ProductController.deleteProduct);
router.post("/delete-many", ProductController.deleteManyProduct);
router.get("/getAllType", ProductController.getAllType);

export default router;
