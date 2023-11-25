import { transporter } from "../dao/database/MailManager.js";
import logger from "../services/logger.js";

export const sendMail = async (req, res) => {
  try {
    const message = {
      from: "sender@server.com",
      to: "receiver@sender.com",
      subject: "Message title",
      text: "Holaaaaaaaaaaaaaaaaaaaaaaaa",
      html: "<p>HTML version of the message</p>",
    };
    transporter.sendMail(message);
    res.send("EMail Enviado");
    logger.info(message, "El Email fue enviado exitosamente");
  } catch (error) {
    logger.error(error);
  }
};
