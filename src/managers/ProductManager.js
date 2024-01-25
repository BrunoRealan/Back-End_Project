import { ProductRepository } from "../repositories/productRepository.js";
import transporter from "../services/mailTransporter.js";
import logger from "../services/logger.js";

const productRepository = new ProductRepository();
export default class ProductManager {
  getProducts = async (limit, query, sort, page) => {
    try {
      const sortObjectMapper = {
        asc: { price: 1 },
        desc: { price: -1 },
      };

      const modelLimit = limit ? parseInt(limit, 10) : 10;
      const modelQuery = query ? JSON.parse(query) : {};
      const modelSort = sortObjectMapper[sort] ?? undefined;
      const modelPage = page ? parseInt(page, 10) : 1;

      const products = await productRepository.get(
        modelLimit,
        modelQuery,
        modelSort,
        modelPage
      );

      const docsDTO = products.docs.map((p) => ({
        id: p._id,
        title: p.title,
        description: p.description,
        price: p.price,
        thumbnail: p.thumbnail,
        stock: p.stock,
        category: p.category,
        owner: p.owner,
      }));

      const productsDTO = {
        status: "success",
        payload: docsDTO,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        //Reemplazar con el link de producción o local
        prevLink: products.hasPrevPage
          ? `https://back-endproject-production.up.railway.app/products/?page=${products.prevPage}`
          : null,
        nextLink: products.hasNextPage
          ? `https://back-endproject-production.up.railway.app/products/?page=${products.nextPage}`
          : null,
      };
      return productsDTO;
    } catch (error) {
      logger.error(error);
    }
  };

  getProductsAll = async () => {
    const products = await productRepository.getAll();
    const productsDTO = products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.thumbnail,
      stock: p.stock,
      category: p.category,
      owner: p.owner,
    }));
    return productsDTO;
  };

  getProductById = async (id) => {
    const product = await productRepository.getById(id);
    const productDTO = {
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      stock: product.stock,
      category: product.category,
      owner: product.owner,
    };
    return productDTO;
  };

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
    owner
  ) => {
    try {
      const products = await productRepository.getAll();
      if (products.some((p) => p.code === code)) {
        logger.warning(`Ya existe un producto de código "${code}"`);
        return;
      }
      const product = {};
      product.title = title;
      product.description = description;
      product.price = price;
      product.thumbnail = thumbnail;
      product.code = code;
      product.stock = stock;
      product.status = status;
      product.category = category;
      product.owner = owner;

      const createdProduct = await productRepository.create(product);

      logger.info(
        `El producto de ID:"${createdProduct._id}" se agregó correctamente a la DB`
      );
      const createdProductDTO = {
        _id: createdProduct._id,
        title: createdProduct.title,
        description: createdProduct.description,
        price: createdProduct.price,
        thumbnail: createdProduct.thumbnail,
        stock: createdProduct.stock,
        category: createdProduct.category,
        owner: createdProduct.owner,
      };
      return createdProductDTO;
    } catch (error) {
      logger.error(error);
    }
  };

  updateProduct = async (
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) => {
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      status === undefined ||
      !stock ||
      !category
    ) {
      logger.warning("Falta algun campo");
      return;
    }
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof code !== "string" ||
      typeof price !== "number" ||
      typeof status !== "boolean" ||
      typeof stock !== "number" ||
      typeof category !== "string" ||
      !Array.isArray(thumbnail)
    ) {
      logger.warning("Asegurate que los campos tienen valores válidos");
      return;
    }
    const productUpdated = await productRepository.update(
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    productUpdated.modifiedCount === 0
      ? logger.warning("El producto no existe o no se ha modificado")
      : logger.info("El producto ha sido actualizado correctamente");
  };

  deleteProduct = async (id) => {
    try {
      const productToDelete = await productRepository.delete(id);
      productToDelete
        ? logger.info(`El producto de Id ${id} ha sido borrado de la DB`)
        : logger.warning("El producto no existe o ya ha sido borrado");
    } catch (error) {
      logger.error(error);
    }
  };

  sendMailDeleteProduct = async (email) => {
    try {
      if (email === undefined) {
        logger.info("No hay usuarios para enviar mail");
        return;
      }
      const sendUserMail = async (email) => {
        const message = {
          from: process.env.MAIL_USER,
          to: email,
          subject: "Un producto premium fue eliminado",
          text: "Te enviamos este mail para notificarte que tu producto premium fue eliminado",
          html: "<p>Te enviamos este mail para notificarte que tu producto premium fue eliminado</p>",
        };
        await transporter.sendMail(message);
        return;
      };
      //Envia un mail a cada usuario que se va a eliminar
      await sendUserMail(user);
      logger.info("El mail por objeto borrado fue enviado al usuario");
      return;
    } catch (error) {
      logger.error(error);
    }
  };
}
