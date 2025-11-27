"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

export type WidgetPosition =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center";

interface ChatWidgetProps {
  position?: WidgetPosition;
}

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Config Constants
const BRAND_COLOR = "widget:bg-[#0074fc]";
const BRAND_NAME = "ORIO OMS BOT";
const GREETING_MESSAGE =
  "Hello! I am the ORIO OMS Assistant. How can I help you manage your orders today?";

const ChatWidget: React.FC<ChatWidgetProps> = ({
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: GREETING_MESSAGE, timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "This is a mock response from ORIO UI.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  // Logic helpers
  const isTop = position.startsWith("top");

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "widget:bottom-5 widget:left-5 widget:items-start";
      case "bottom-center":
        return "widget:bottom-5 widget:left-1/2 widget:-translate-x-1/2 widget:items-center";
      case "top-right":
        return "widget:top-5 widget:right-5 widget:items-end";
      case "top-left":
        return "widget:top-5 widget:left-5 widget:items-start";
      case "top-center":
        return "widget:top-5 widget:left-1/2 widget:-translate-x-1/2 widget:items-center";
      default:
        return "widget:bottom-5 widget:right-5 widget:items-end";
    }
  };

  const getOriginClass = () => {
    switch (position) {
      case "bottom-left":
        return "widget:origin-bottom-left";
      case "bottom-center":
        return "widget:origin-bottom";
      case "top-right":
        return "widget:origin-top-right";
      case "top-left":
        return "widget:origin-top-left";
      case "top-center":
        return "widget:origin-top";
      default:
        return "widget:origin-bottom-right";
    }
  };

  return (
    <div
      className={`widget:fixed widget:z-50 widget:flex widget:flex-col widget:font-sans ${getPositionClasses()}`}
    >
      {/* 1. CHAT WINDOW (Moved Inline to fix Input Focus Issue) */}
      <div
        className={`
          widget:transition-all widget:duration-300 widget:ease-in-out widget:transform ${getOriginClass()}
          ${
            isOpen
              ? "widget:scale-100 widget:opacity-100 widget:translate-y-0"
              : `widget:scale-95 widget:opacity-0 widget:pointer-events-none ${
                  isTop ? "-widget:translate-y-4" : "widget:translate-y-4"
                }`
          }
          widget:w-[350px] sm:widget:w-[380px] widget:h-[500px] widget:max-h-[80vh]
          widget:bg-white widget:rounded-2xl! widget:shadow-2xl widget:border widget:border-gray-200 widget:overflow-hidden widget:flex widget:flex-col
          ${isTop ? "widget:mt-4" : "widget:mb-4"} 
          ${isTop ? "widget:order-2" : "widget:order-1"}
        `}
      >
        {/* Header */}
        <div
          className={`${BRAND_COLOR} widget:p-4 widget:flex widget:items-center widget:justify-between widget:text-white widget:shadow-md`}
        >
          <div className="widget:flex widget:items-center widget:gap-2">
            <div className="widget:bg-white/20 widget:p-1.5 widget:rounded-full!">
              <Bot size={20} className="widget:text-white" />
            </div>
            <div>
              <h3 className="widget:font-bold widget:text-sm widget:mb-0!">
                {BRAND_NAME}
              </h3>
              <p className="widget:text-xs widget:text-indigo-100 widget:flex widget:items-center widget:gap-1 widget:mb-0!">
                <span className="widget:w-2 widget:h-2 widget:bg-green-400 widget:rounded-full! widget:animate-pulse"></span>{" "}
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:widget:bg-white/20 widget:p-1 widget:rounded widget:transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="widget:flex-1 widget:overflow-y-auto widget:p-4 widget:bg-gray-50 widget:space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`widget:flex widget:w-full ${
                msg.role === "user"
                  ? "widget:justify-end"
                  : "widget:justify-start"
              }`}
            >
              <div
                className={`
                widget:max-w-[80%] widget:p-3 widget:rounded-2xl! widget:text-sm widget:shadow-sm
                ${
                  msg.role === "user"
                    ? `${BRAND_COLOR} widget:text-white widget:rounded-br-none!`
                    : "widget:bg-white widget:text-gray-800 widget:border widget:border-gray-100 widget:rounded-bl-none!"
                }
              `}
              >
                <p className="widget:leading-relaxed widget:mb-0!">
                  {msg.content}
                </p>
                <span
                  className={`widget:text-[10px] widget:block widget:mt-1 widget:opacity-70 ${
                    msg.role === "user"
                      ? "widget:text-indigo-100"
                      : "widget:text-gray-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="widget:flex widget:justify-start widget:w-full">
              <div className="widget:bg-white widget:border widget:border-gray-100 widget:p-3 widget:rounded-2xl! widget:rounded-bl-none! widget:shadow-sm widget:flex widget:items-center widget:gap-1">
                <div
                  className="widget:w-2 widget:h-2 widget:bg-gray-400 widget:rounded-full! widget:animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="widget:w-2 widget:h-2 widget:bg-gray-400 widget:rounded-full! widget:animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="widget:w-2 widget:h-2 widget:bg-gray-400 widget:rounded-full! widget:animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="widget:p-3 widget:bg-white widget:border-t widget:border-gray-100">
          <form
            onSubmit={handleSendMessage}
            className="widget:flex widget:items-center widget:gap-2 widget:bg-gray-100 widget:rounded-full! widget:px-4 widget:py-2 widget:border focus-within:widget:border-indigo-500 focus-within:widget:bg-white widget:transition-colors"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="widget:flex-1 widget:bg-transparent widget:border-none widget:outline-none widget:text-sm widget:text-gray-700 widget:placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`widget:p-2 widget:rounded-full! widget:transition-all widget:duration-200 ${
                inputValue.trim()
                  ? `${BRAND_COLOR} widget:text-white hover:widget:opacity-90 widget:shadow-md`
                  : "widget:bg-gray-300 widget:text-gray-500 widget:cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <Loader2 size={16} className="widget:animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
          <div className="widget:text-center widget:mt-2">
            <p className="widget:text-[10px] widget:text-gray-400 widget:mb-0!">
              Powered by ORIO AI
            </p>
          </div>
        </div>
      </div>

      {/* 2. TOGGLE BUTTON (Moved Inline) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          widget:group widget:relative widget:flex widget:items-center widget:justify-center widget:w-14 widget:h-14 widget:rounded-full! widget:shadow-lg widget:cursor-pointer widget:transition-all widget:duration-300 hover:widget:scale-110
          ${
            isOpen
              ? "widget:bg-red-500 widget:rotate-90"
              : `${BRAND_COLOR} widget:rotate-0`
          }
          ${isTop ? "widget:order-1" : "widget:order-2"}
        `}
      >
        {isOpen ? (
          <X
            size={28}
            className="widget:text-white widget:transition-transform"
          />
        ) : (
          <MessageCircle
            size={28}
            className="widget:text-white widget:transition-transform"
          />
        )}
        {!isOpen && (
          <span className="widget:absolute widget:top-0 widget:right-0 widget:w-4 widget:h-4 widget:bg-red-500 widget:border-2 widget:border-white widget:rounded-full!"></span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
