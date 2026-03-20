import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Mic, Sparkles, BookOpen, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const modes = [
  { label: "Explain Simply", icon: Sparkles, desc: "Break it down" },
  { label: "Exam Mode", icon: GraduationCap, desc: "Test yourself" },
  { label: "Quick Revision", icon: BookOpen, desc: "Key points" },
];

const sampleResponses: Record<string, string> = {
  default: "I'd be happy to help! Please ask me any question about your subjects, and I'll explain it in a way that makes sense. You can also choose a mode above to change how I respond.",
  explain: "**Newton's Second Law** states that the force acting on an object equals its mass times acceleration (F = ma).\n\n**Simply put:** The harder you push something, the faster it moves. Heavier things need more force to get moving.\n\n**Example:** Pushing a shopping cart vs pushing a car — same force, very different results because of mass!",
  exam: "**Quick Quiz: Newton's Laws**\n\n1. A 5kg object accelerates at 3 m/s². What is the net force?\n   - A) 8 N\n   - B) 15 N ✅\n   - C) 1.67 N\n\n2. Which law explains why you feel pushed back when a car accelerates?\n   - A) First Law ✅\n   - B) Second Law\n   - C) Third Law",
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey there! 👋 I'm your AI Study Buddy. Ask me anything about your subjects, and I'll help you understand it better. Choose a mode below to customize my responses!" },
  ]);
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState("Explain Simply");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const response = input.toLowerCase().includes("newton")
      ? activeMode === "Exam Mode" ? sampleResponses.exam : sampleResponses.explain
      : sampleResponses.default;
    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: response }]);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Bot className="w-7 h-7 text-primary" /> AI Assistant
        </h1>
      </motion.div>

      {/* Mode buttons */}
      <div className="flex gap-2 flex-wrap">
        {modes.map((m) => (
          <Button key={m.label} variant={activeMode === m.label ? "hero" : "glass"} size="sm"
            onClick={() => setActiveMode(m.label)} className="gap-1.5">
            <m.icon className="w-4 h-4" /> {m.label}
          </Button>
        ))}
      </div>

      {/* Chat area */}
      <GlassCard className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted/40 text-foreground rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </GlassCard>

      {/* Input */}
      <div className="flex gap-2">
        <Button variant="glass" size="icon" className="shrink-0"><Mic className="w-4 h-4" /></Button>
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything..." className="bg-muted/30 border-border" />
        <Button variant="hero" size="icon" onClick={sendMessage} className="shrink-0"><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
