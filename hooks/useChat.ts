import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "@/lib/api";

export const useChatMutation = () => {
  return useMutation({
    mutationFn: (question: string) => sendChatMessage(question),
  });
};
