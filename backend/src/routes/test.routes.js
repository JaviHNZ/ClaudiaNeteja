import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/perfil", verifyToken, (req, res) => {
  res.json({
    message: "Acceso correcto 🔐",
    user: req.user,
  });
});

export default router;