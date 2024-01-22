import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = join("public", "documents"); // destino default

    if (file.fieldname === "profile") {
      dest = join("public", "profiles");
    } else if (file.fieldname === "product") {
      dest = join("public", "products");
    }

    const dir = join(__dirname, "..", dest);
    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // sufijo unico
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});
const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/bmp" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true); // aceptar el file
  } else {
    cb(null, false); // rechasar el file
  }
};

export const uploadFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000000 },
});
