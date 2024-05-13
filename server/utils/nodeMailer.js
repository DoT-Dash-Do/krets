import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.NM_EMAIL,
      pass: process.env.NM_PASSWORD,
    },
  });