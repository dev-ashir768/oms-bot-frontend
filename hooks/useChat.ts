import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "@/lib/api";

export const useChatMutation = () => {
  return useMutation({
    mutationFn: ({
      question,
      history,
    }: {
      question: string;
      history: { role: "user" | "model"; content: string }[];
    }) => sendChatMessage(question, history),
  });
};
