import { ticketModel } from "../dao/database/models/ticketModel.js";
import logger from "../services/logger.js";

export class TicketReposiotory {
  create = async (newAmount, newPurchaser) => {
    try {
      const newTicket = await ticketModel.create({
        amount: newAmount,
        purchaser: newPurchaser,
      });
      return newTicket;
    } catch (error) {
      logger.error(error);
    }
  };
}
