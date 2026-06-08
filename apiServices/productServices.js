import { api } from "boot/axios";

export const getProducts = async () => {
  try {
    const response = await api.get("products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const sendBulkInvoice = async (
  chargeTransactionIds = [],
  selectedDateTime = null
) => {
  try {
    const body = {
      chargeTransactionIds,
      selectedDateTime,
    };

    // Use full URL to target the local service regardless of api.baseURL
    const response = await api.post(
      "http://localhost:8081/api/sendBulkInvoice",
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error sending bulk invoice:", error);
    throw error;
  }
};
