import { Router } from "express";
import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { contactFormValidator } from "../validators/contactValidator.js";
import { validate } from "../middlewares/validate.js";
import sendResponse from "../utils/responseUtil.js";

interface ContactFormBody {
  name: string;
  email: string;
  message: string;
}

const router = Router();

router.post(
  "/",
  contactFormValidator,
  validate,
  async (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return sendResponse(res, "error", "Bad request: missing fields.");
    }
    try {
      // create Gmail transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `Nev Contact Form Submission from ${name}`,
        text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        html: `
          <p>You have received a new message from your website contact form.</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      sendResponse(res, "success", "Message sent successfully.");
    } catch (err) {
      console.error("Error posting the contact form: ", err);
      sendResponse(res, "error", "Internal Server Error.", undefined, 500);
    }
  },
);

export default router;
