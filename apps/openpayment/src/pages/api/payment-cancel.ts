// pages/api/payment-cancel.ts
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponse = {
  status: string;
  message: string;
  url: string;
};

type ErrorResponse = {
  error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Call the new cancel endpoint on your backend
    const response = await axios.post(
      "http://192.168.0.198:2030/api/business-transactions/cancel",
      { token, status: "cancelled" }
    );
    
    console.log("Cancel response data from backend:", response.data);

    // Return the same URL structure as successful payment
    res.status(200).json({
      message: "Transaction cancelled",
      status: response.data.status,
      url: response.data.url,
    });
  } catch (error) {
    console.error("Error cancelling payment:", error);

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || "Failed to cancel payment";
      res.status(statusCode).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
