import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Explain this week's topic in simpler terms",
  "What should I study next?",
  "Quiz me on what I've covered so far",
  "Suggest resources for my current course",
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI learning assistant. I can explain course material, quiz you on concepts, and suggest what to study next. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        role: "assistant",
        content:
          "That's a great question! Let me think about that... This is a demo response. In a full implementation, this would connect to an AI backend to provide contextual learning assistance based on your course materials.",
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-border/50 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sage/15 flex items-center justify-center">
              <Bot className="w-5 h-5 text-sage" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-lg font-medium text-foreground">AI Tutor</h1>
              <p className="text-[11px] text-muted-foreground">AI-powered learning assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 animate-fade-up ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-sage/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-sage" strokeWidth={1.8} />
                </div>
              )}
              <div
                className={`max-w-[600px] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-sage text-primary-foreground"
                    : "bg-card shadow-card border border-border/30 text-foreground"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-terracotta/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-terracotta" strokeWidth={1.8} />
                </div>
              )}
            </div>
          ))}

          {messages.length === 1 && (
            <div className="grid grid-cols-2 gap-2 max-w-[500px] animate-fade-up" style={{ animationDelay: "200ms" }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                  }}
                  className="text-left px-4 py-3 rounded-xl border border-border/50 bg-card text-sm text-muted-foreground hover:text-foreground hover:border-sage/30 transition-sanctuary active:scale-[0.98]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-8 py-4 border-t border-border/50">
          <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-card border border-border/30 focus-within:ring-2 focus-within:ring-sage/20 transition-sanctuary">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask your tutor anything..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center hover:bg-sage-hover transition-sanctuary active:scale-[0.95]"
            >
              <Send className="w-4 h-4 text-primary-foreground" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
