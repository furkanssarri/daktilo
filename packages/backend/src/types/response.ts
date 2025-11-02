export interface ResponseJsonObject {
  status: "success" | "error";
  message: string;
  data?: {};
}
