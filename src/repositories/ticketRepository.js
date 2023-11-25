import { ticketModel } from "../dao/database/models/ticketModel.js";
import logger from "../services/logger.js";

export class TicketReposiotory {
  create = async (newCode, newAmount, newPurchaser) => {
    try {
      const newTicket = await ticketModel.create({
        code: newCode,
        amount: newAmount,
        purchaser: newPurchaser,
      });
      return newTicket;
    } catch (error) {
      logger.error(error);
    }
  };
}
