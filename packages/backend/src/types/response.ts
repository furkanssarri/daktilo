export interface ResponseJsonObject<T> {
  status: "success" | "error";
  message: string;
  data?: T;
}
