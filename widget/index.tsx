import { createRoot, Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatWidget, { WidgetPosition } from "@/components/widget/ChatWidget";
import "@/app/globals.css";

/**
 * ----------------------------------------------------------------------
 * TYPE DEFINITIONS
 * ----------------------------------------------------------------------
 */
interface WidgetConfig {
  position?: WidgetPosition;
}

// Global Window Interface Extension
declare global {
  interface Window {
    Bot: {
      init: (config?: WidgetConfig) => void;
      destroy: () => void;
      open: () => void;
      close: () => void;
      config?: WidgetConfig;
    };
  }
}

/**
 * ----------------------------------------------------------------------
 * WIDGET MANAGER (Singleton Class)
 * ----------------------------------------------------------------------
 * This class handles the lifecycle of the widget:
 * - Injection into DOM
 * - React Mounting/Unmounting
 * - Configuration Management
 */
class BotWidgetManager {
  private static instance: BotWidgetManager;
  private root: Root | null = null;
  private containerId = "bot-chat-widget-root";
  private config: WidgetConfig = {};

  private constructor() {
    this.exposeGlobalApi();
    this.handleAutoInit();
  }

  // Singleton Instance Access
  public static getInstance(): BotWidgetManager {
    if (!BotWidgetManager.instance) {
      BotWidgetManager.instance = new BotWidgetManager();
    }
    return BotWidgetManager.instance;
  }

  /**
   * 1. Expose API to Window Object
   * Allows developers to control widget via window.Bot.init()
   */
  private exposeGlobalApi() {
    window.Bot = {
      init: (config) => this.init(config),
      destroy: () => this.destroy(),
      open: () => this.dispatchWidgetEvent("BOT_OPEN_WIDGET"),
      close: () => this.dispatchWidgetEvent("BOT_CLOSE_WIDGET"),
    };
  }

  /**
   * 2. Initialize and Mount Widget
   */
  public init(config: WidgetConfig = {}) {
    // Prevent duplicate initialization
    if (document.getElementById(this.containerId)) {
      console.warn("⚠️ BOT Widget is already initialized.");
      return;
    }

    this.config = config;
    window.Bot.config = config; // Store config globally for debugging

    // Ensure DOM is ready before mounting
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      this.mount();
    } else {
      window.addEventListener("DOMContentLoaded", () => this.mount());
    }
  }

  /**
   * 3. Mount Logic (Create DOM Element & React Root)
   */
  private mount() {
    try {
      const container = document.createElement("div");
      container.id = this.containerId;

      // Shadow DOM could be used here for CSS isolation,
      // but since we are bundling Tailwind, we inject into light DOM for simplicity.
      document.body.appendChild(container);

      this.root = createRoot(container);

      // Create a client
      const queryClient = new QueryClient();

      // Injecting Config Props if ChatWidget supports them (Future Proofing)
      this.root.render(
        <QueryClientProvider client={queryClient}>
          <ChatWidget position={this.config.position} />
        </QueryClientProvider>
      );

      console.log("🚀 BOT Chat Widget Initialized Successfully");
    } catch (error) {
      console.error("❌ Failed to initialize BOT Widget:", error);
    }
  }

  /**
   * 4. Cleanup Logic
   */
  public destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    const container = document.getElementById(this.containerId);
    if (container) {
      container.remove();
    }

    console.log("🛑 BOT Widget Destroyed");
  }

  /**
   * Helper: Dispatch Custom Events for internal communication
   */
  private dispatchWidgetEvent(eventName: string) {
    const event = new CustomEvent(eventName);
    window.dispatchEvent(event);
  }

  /**
   * Check for 'data-auto-init' attribute on the script tag
   */
  private handleAutoInit() {
    // Current script tag detection
    const script = document.currentScript as HTMLScriptElement;
    if (script && script.hasAttribute("data-auto-init")) {
      this.init();
    }
  }
}

// Start the Manager
BotWidgetManager.getInstance();
