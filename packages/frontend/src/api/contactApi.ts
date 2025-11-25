import { apiRequest } from "./apiClient";
import type { ContactFormValues } from "@/validators/authValidators";

interface ContactResponse {
  status: "success" | "error";
  message: string;
  data?: unknown;
}

const contactApi = {
  async sendMessage(values: ContactFormValues): Promise<ContactResponse> {
    return apiRequest<ContactResponse>("/contact", {
      method: "POST",
      body: JSON.stringify(values),
    });
  },
};

export default contactApi;
