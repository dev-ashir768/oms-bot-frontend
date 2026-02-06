import axios from "axios";

export const API_BASE_URL = "http://localhost:4000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChatRequest {
  question: string;
  history?: { role: "user" | "model"; content: string }[];
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    question: string;
    answer: string;
    source: string;
  };
}

export const sendChatMessage = async (
  question: string,
  history: { role: "user" | "model"; content: string }[] = [],
): Promise<string> => {
  try {
    const response = await apiClient.post<ChatResponse>("/chat", {
      question,
      history,
    });
    return response.data.data.answer;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch response",
      );
    }
    throw error;
  }
};
