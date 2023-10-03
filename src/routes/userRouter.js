import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.send("Ya estas registrado");
  }
  const user = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  });

  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.email = email;
  req.session.age = age;
  req.session.role = "user";
  req.session.isLogged = true;

  res.redirect("/products");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, password }).lean();

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.first_name = "Coder";
    req.session.last_name = "House";
    req.session.email = email;
    req.session.role = "admin";
    req.session.isLogged = true;

    return res.redirect("/products");
  }

  if (!user) {
    return res.send("Tus datos no son correctos");
  }

  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.role = "user";
  req.session.isLogged = true;

  return res.redirect("/products");
});

export default router;
