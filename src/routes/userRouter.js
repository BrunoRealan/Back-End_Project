import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  gitHubCallBack,
  resetPassword,
  changeUserToPremium,
  sendDocuments,
} from "../controllers/userController.js";
import { uploadFiles } from "../middlewares/uploadFiles.js";

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
  passport.authenticate("github", { scope: ["user.email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  gitHubCallBack
);

router.post("/resetPassword/:rId", resetPassword);

router.get("/premium/:uId", changeUserToPremium);

router.post("/:uId/documents", uploadFiles.any(), sendDocuments);

export default router;
