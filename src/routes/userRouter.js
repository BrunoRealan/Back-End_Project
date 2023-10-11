import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import bcrypt from "bcrypt";
import passport from "passport";

const router = Router();

router.post(
  "/signup",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    //ENTREGA ANTERIOR AHORA AUTENTIFICA POR PASSPORT
    /* const { first_name, last_name, email, age, password } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.send("Ya estas registrado");
  }
  const user = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  });

  req.session.first_name = first_name;
  req.session.last_name = last_name;
  req.session.email = email;
  req.session.age = age;
  req.session.role = "user";
  req.session.isLogged = true;
 */
    res.redirect("/login");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    /*const { email, password } = req.body;
  const user = await userModel.findOne({ email }).lean();

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.first_name = "Coder";
    req.session.last_name = "House";
    req.session.email = email;
    req.session.role = "admin";
    req.session.isLogged = true;

    return res.redirect("/profile");
  }

  if (!user) {
    return res.send("Tus datos no son correctos");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.send("El correro o contraseña no son válidos");
  }
  req.session.first_name = user.first_name;
  req.session.last_name = user.last_name;
  req.session.email = user.email;
  req.session.age = user.age;
  req.session.role = "user";
  req.session.isLogged = true;
*/

    if (!req.user) {
      res.status(400).send("Tus datos no son correctos");
    }

    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;
    req.session.role = "user";
    req.session.isLogged = true;
    return res.redirect("/profile");
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user.email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;
    req.session.role = "user";
    req.session.isLogged = true;
    res.redirect("/profile");
  }
);

export default router;
