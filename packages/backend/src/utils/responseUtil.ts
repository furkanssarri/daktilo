import type { Response } from "express";
import { ResponseJsonObject } from "../types/response.js";

const sendResponse = <T>(
  res: Response<ResponseJsonObject<T>>,
  status: "success" | "error",
  message: string,
  data?: T,
  code: number = status === "success" ? 200 : 400,
): Response<ResponseJsonObject<T>> => {
  return res.status(code).json({
    status,
    message,
    ...(data && { data }),
  });
};

export default sendResponse;
