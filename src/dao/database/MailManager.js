import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "kimberly.harber@ethereal.email",
    pass: "pBh4GTpqVmDP4dkZvR",
  },
});
