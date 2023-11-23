import { userModel } from "../dao/database/models/userModel.js";
import bcrypt from "bcrypt";
import CustomError from "../services/errors/CustomError.js";

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
  req.session.cart = req.user.cart;
  req.session.role = req.user.role;
  req.session.isLogged = true;
  console.log(req.session);
  return res.redirect("/profile");
};

export const gitHubCallBack = (req, res) => {
  req.session.first_name = req.user.first_name;
  req.session.last_name = req.user.last_name;
  req.session.email = req.user.email;
  req.session.age = req.user.age;
  req.session.cart = req.user.cart;
  req.session.role = req.user.role;
  req.session.isLogged = true;
  console.log(req.session.role, req.session.age);
  res.redirect("/profile");
};
