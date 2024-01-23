import { UserRepository } from "../repositories/userRepository.js";
import { RecoverRepository } from "../repositories/recoverRespository.js";
import transporter from "../services/mailTransporter.js";
import bcrypt from "bcrypt";
import logger from "../services/logger.js";

const userRepository = new UserRepository();
const recoverRepository = new RecoverRepository();

export default class UserManager {
  getByEmail = async (email) => {
    try {
      const user = await userRepository.getByEmail(email);
      return user;
    } catch (error) {
      logger.error(error);
    }
  };

  getById = async (id) => {
    try {
      const user = await userRepository.getById(id);
      return user;
    } catch (error) {
      logger.error(error);
    }
  };

  getAllUsers = async () => {
    try {
      const users = await userRepository.getAll();
      console.log("users:", users);
      const realUsers = users.filter((user) => user.role !== "admin");
      const usersDTO = realUsers.map((user) => ({
        id: user._id.toString(),
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
      }));
      console.log("usersDTO:", usersDTO);
      return usersDTO;
    } catch (error) {
      logger.error(error);
    }
  };

  changeUserCredential = async (id) => {
    try {
      const user = await userRepository.getById(id);
      if (user.role === "user") {
        user.role = "premium";
        return user.save();
      } else if (user.role === "premium") {
        user.role = "user";
        return user.save();
      }
    } catch (error) {
      logger.error(error);
    }
  };

  createRecoverTicket = async (uId) => {
    try {
      const recover = await recoverRepository.create(uId);
      return recover;
    } catch (error) {
      logger.error(error);
    }
  };

  getRecoverTicket = async (id) => {
    try {
      const recoverTicket = await recoverRepository.getById(id);
      return recoverTicket;
    } catch (error) {
      logger.error(error);
    }
  };

  updatePassword = async (id, newPassword) => {
    try {
      const user = await userRepository.getById(id);

      if (user === undefined) {
        let warn = "No existe el usuario en el registro";
        logger.warning(warn);
        return;
      }
      if (newPassword === "") {
        let warn = "Debes escribir una contraseña para contnuar";
        logger.warning(warn);
        return;
      }
      if (bcrypt.compareSync(newPassword, user.password)) {
        let warn = "No puedes volver a usar una contraseña antigua";
        logger.warning(warn);
        return;
      }
      user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
      await user.save();
      logger.info("La contraseña fue cambiada satisfactoriamente");

      const userDTO = { user: user.first_name };
      return userDTO;
    } catch (error) {
      logger.error(error);
    }
  };

  updateLastConnection = async (email) => {
    try {
      const user = await userRepository.getByEmail(email);
      const lastConnectionUpdated = (user.last_connection = Date.now());
      await user.save();
      return lastConnectionUpdated;
    } catch (error) {
      logger.error(error);
    }
  };

  usersToDelete = async () => {
    try {
      const users = await userRepository.getAll();
      //Filtra los usuarios que no se conectaron en los ultimos 2 dias
      const usersToDelete = users.filter(
        (user) =>
          new Date(user.last_connection).getTime() < Date.now() - 86400000 * 2
      );
      //Filtra los usuarios que no son admin
      const usersWithoutAdmin = usersToDelete.filter(
        (user) => user.role !== "admin"
      );
      return usersWithoutAdmin;
    } catch (error) {
      logger.error(error);
    }
  };

  sendMailToDeleteUsers = async (usersToDelete) => {
    try {
      if (usersToDelete.length === 0) {
        logger.info("No hay usuarios para eliminar");
        return;
      }
      const sendUsersMail = async (user) => {
        const message = {
          from: process.env.MAIL_USER,
          to: user.email,
          subject: "Cuenta eliminada",
          text: "Te enviamos este mail para notificarte que tu cuenta fue eliminada por inactividad",
          html: "<p>Te enviamos este mail para notificarte que tu cuenta fue eliminada por inactividad</p>",
        };
        await transporter.sendMail(message);
        return;
      };
      //Envia un mail a cada usuario que se va a eliminar
      await Promise.all(usersToDelete.map((user) => sendUsersMail(user)));
      logger.info("Los mails a usuarios a borrar fueron enviados");
      return;
    } catch (error) {
      logger.error(error);
    }
  };

  deleteOne = async (id) => {
    try {
      const deleteResult = await userRepository.deleteOne(id);
      logger.info("El usuario fue eliminado");
      return deleteResult;
    } catch (error) {
      logger.error(error);
    }
  };

  deleteUsers = async (usersToDelete) => {
    try {
      const idsToDelete = usersToDelete.map((user) => user._id);
      const deleteResult = await userRepository.deleteMany(idsToDelete);
      return deleteResult;
    } catch (error) {
      logger.error(error);
    }
  };
}
