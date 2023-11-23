import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  gitHubCallBack,
} from "../controllers/userController.js";

const router = Router();

router.post(
  "/signup",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  register
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  login
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user.email"] }),
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  gitHubCallBack
);

export default router;
