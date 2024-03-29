import transporter from "../services/mailTransporter.js";
import { RecoverRepository } from "../repositories/recoverRespository.js";
import { UserRepository } from "../repositories/userRepository.js";
import logger from "../services/logger.js";
import dotenv from "dotenv";
import UserManager from "../managers/UserManager.js";

dotenv.config();
const userManager = new UserManager();
const recoverRepository = new RecoverRepository();

export const sendMail = async (req, res) => {
  try {
    const message = {
      from: process.env.MAIL_USER,
      to: "brunorealans@gmail.com",
      subject: "Message title",
      text: "Holaaaaaaaaaaaaaaaaaaaaaaaa",
      html: "<p>HTML version of the message</p>",
    };
    transporter.sendMail(message);
    res.send("EMail Enviado");
    logger.info(JSON.stringify(message), "El Email fue enviado exitosamente");
  } catch (error) {
    logger.error(error);
  }
};

export const sendResetMail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userManager.getByEmail(email);
    const recover = await userManager.createRecoverTicket(user._id);

    const message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password restore mail",
      text: "We sent this mail to restore your password to ECommerce Web",
      html: `<p>We sent this mail to restore your password to ECommerce Web. Click the following link: <a href="http://localhost:8080/resetPassword/${recover._id}">Go to site</a></p>`,
    };
    transporter.sendMail(message);
    res.send("EMail Enviado");
  } catch (error) {
    logger.error(error);
  }
};
