import { Router } from "express";
import { authController } from "./autho.controller";

const router = Router();

router.post("/login", authController.loginUser)

export const authRoute = router;