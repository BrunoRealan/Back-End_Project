import { transporter } from "../dao/database/MailManager.js";
import { RecoverRepository } from "../repositories/recoverRespository.js";
import { UserRepository } from "../repositories/userRepository.js";
import logger from "../services/logger.js";
import dotenv from "dotenv";

dotenv.config();
const userRepository = new UserRepository();
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
    const user = await userRepository.get(email);
    const recover = await recoverRepository.create(user._id);
    logger.debug(user._id);
    logger.debug(JSON.stringify(recover));

    const message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password restore mail",
      text: "We sent this mail to restore your password to ECommerce Web",
      html: `<p>We sent this mail to restore your password to ECommerce Web. Click the following link: <a href="http://localhost:8080/resetPassword/${recover._id}">Go to site</a></p>`,
    };
    transporter.sendMail(message);
    res.send("EMail Enviado");
    logger.info(JSON.stringify(message));
  } catch (error) {
    logger.error(error);
  }
};
