import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { Flame, Zap, Target, Brain, CheckCircle2, Circle, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const todayTasks = [
  { text: "Review Physics: Kinematics (Ch 3)", done: true },
  { text: "Solve 20 Math problems – Integration", done: true },
  { text: "Read Chemistry: Organic Reactions", done: false },
  { text: "Practice Biology: Cell Division MCQs", done: false },
  { text: "Revise English Grammar Notes", done: false },
];

const weakAreas = [
  { subject: "Physics", topic: "Electromagnetic Induction", score: 35 },
  { subject: "Math", topic: "Differential Equations", score: 42 },
  { subject: "Chemistry", topic: "Thermodynamics", score: 48 },
];

const aiSuggestions = [
  "Spend 30 more minutes on Electromagnetic Induction today",
  "Try practice problems from Chapter 7 before moving on",
  "Your math speed is improving! Keep it up 🎉",
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Welcome back, <span className="gradient-text">Student!</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your study overview for today.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Study Streak" value="12 Days" change="+2 from last week" delay={0.1} iconColor="text-xp" />
        <StatCard icon={Zap} label="XP Points" value="2,450" change="+180 today" delay={0.2} iconColor="text-primary" />
        <StatCard icon={Target} label="Tasks Done" value="2/5" delay={0.3} iconColor="text-success" />
        <StatCard icon={Brain} label="AI Sessions" value="8" delay={0.4} iconColor="text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <GlassCard delay={0.3} className="lg:col-span-2">
          <h2 className="font-display font-semibold text-lg mb-4 text-foreground">📋 Today's Study Plan</h2>
          <div className="space-y-3">
            {todayTasks.map((task, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${task.done ? "bg-success/10" : "bg-muted/30 hover:bg-muted/50"}`}>
                {task.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.text}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* AI Suggestions */}
        <GlassCard delay={0.4}>
          <h2 className="font-display font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-xp" /> AI Suggestions
          </h2>
          <div className="space-y-3">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-foreground/80">
                {s}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Weak Areas */}
      <GlassCard delay={0.5}>
        <h2 className="font-display font-semibold text-lg mb-4 text-foreground">⚠️ Weak Areas – Needs Attention</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weakAreas.map((area, i) => (
            <div key={i} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <p className="font-medium text-sm text-foreground">{area.subject}</p>
              <p className="text-xs text-muted-foreground mb-2">{area.topic}</p>
              <Progress value={area.score} className="h-2" />
              <p className="text-xs text-destructive mt-1">{area.score}% mastery</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
