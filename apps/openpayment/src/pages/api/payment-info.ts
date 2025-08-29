// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

// Types that match the expected response structure in the frontend
type PaymentInfo = {
  orderNumber: string;
  merchant: string;
  merchantWebsite: string;
  amount: string;
  currency: string;
};

type SuccessResponse = {
  paymentInfo: PaymentInfo;
};

type ErrorResponse = {
  error: string;
};

// Combined response type
type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Ensure we only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check if token is provided in request body
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Make the request to your backend service
    const response = await axios.post(
      'https://keycloakssbms.dedyn.io/jtpay-service/api/business-transactions/payment-info',

      { token }
    );

    // Log the response data for debugging
    console.log("Response data from backend:", response.data);

    // Transform the backend response into the format expected by the frontend
    const paymentInfo = {
      orderNumber: response.data.commande || "",
      merchant: response.data.merchantname || "",
      merchantWebsite: response.data.website || "",
      amount: response.data.amount?.toString() || "",
      currency: response.data.currency || ""
    };

    // Send the transformed data
    res.status(200).json({ paymentInfo });
  } catch (error) {
    console.error("Error fetching payment info:", error);

    // Format error response to match what the frontend expects
    if (axios.isAxiosError(error)) {
      // Extract Axios error information
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || "Failed to fetch payment info";

      res.status(statusCode).json({ error: errorMessage });
    } else {
      // Generic error handling
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
