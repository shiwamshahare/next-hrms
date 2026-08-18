import { Router } from "express";
import { signIn, getCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Sign In Route
router.post("/login", signIn);
router.post("/sign-in", signIn);

// Current User Session Route (Protected)
router.get("/me", authenticateToken, getCurrentUser);

export default router;
