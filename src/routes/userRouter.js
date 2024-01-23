import { Router } from "express";
import passport from "passport";
import {
  getAllUsers,
  deleteOldUsers,
  deleteUser,
  register,
  login,
  gitHubCallBack,
  resetPassword,
  changeCredentials,
  sendDocuments,
} from "../controllers/userController.js";
import { uploadFiles } from "../middlewares/uploadFiles.js";
import adminRoutes from "../middlewares/adminRoutes.js";

const router = Router();

router.get("/", adminRoutes, getAllUsers);

router.delete("/", adminRoutes, deleteOldUsers);

router.delete("/:uId", adminRoutes, deleteUser);

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

router.get("/premium/:uId", changeCredentials);

router.post("/:uId/documents", uploadFiles.any(), sendDocuments);

export default router;
