import { GlassCard } from "@/components/GlassCard";
import { BookOpen, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const subjects = [
  { name: "Physics", topics: 12, completed: 7, color: "from-primary to-secondary", icon: "⚡" },
  { name: "Mathematics", topics: 15, completed: 10, color: "from-secondary to-info", icon: "📐" },
  { name: "Chemistry", topics: 10, completed: 4, color: "from-accent to-primary", icon: "🧪" },
  { name: "Biology", topics: 14, completed: 9, color: "from-success to-info", icon: "🧬" },
  { name: "English", topics: 8, completed: 6, color: "from-xp to-warning", icon: "📖" },
  { name: "Computer Science", topics: 11, completed: 8, color: "from-primary to-accent", icon: "💻" },
];

export default function SubjectsPage() {
  const [filter, setFilter] = useState("");
  const filtered = subjects.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary" /> Subjects
        </h1>
        <p className="text-muted-foreground mt-1">Track your progress across all subjects and topics.</p>
      </motion.div>

      <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search subjects..." className="max-w-sm bg-muted/30 border-border" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((subject, i) => (
          <GlassCard key={subject.name} delay={i * 0.1} className="group hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl`}>
                  {subject.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{subject.name}</h3>
                  <p className="text-xs text-muted-foreground">{subject.topics} topics</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <Progress value={(subject.completed / subject.topics) * 100} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">{subject.completed}/{subject.topics} topics completed • {Math.round((subject.completed / subject.topics) * 100)}% mastery</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
