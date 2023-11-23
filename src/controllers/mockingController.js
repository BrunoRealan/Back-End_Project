import { MockingRepository } from "../repositories/mockingRepository.js";

const mockingRepository = new MockingRepository();

export const mockingProducts = async (req, res) => {
  const products = await mockingRepository.get();
  res.status(200).send(products);
};
