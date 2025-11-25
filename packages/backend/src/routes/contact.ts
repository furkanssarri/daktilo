import { Router } from "express";
import type { Request, Response } from "express";
import { Resend } from "resend";
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
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Daktilo Contact <noreply@yourdomain.com>",
        to: process.env.ADMIN_EMAIL!,
        subject: `New Contact Message from ${name}`,
        html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
      });

      sendResponse(res, "success", "Message sent successfully.");
    } catch (err) {
      console.error("Resend email error:", err);
      sendResponse(res, "error", "Internal Server Error", undefined, 500);
    }
  },
);

export default router;
