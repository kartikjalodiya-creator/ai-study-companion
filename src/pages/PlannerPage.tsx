import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Sparkles, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { useSubjects } from "@/contexts/SubjectsContext";
import { useNavigate } from "react-router-dom";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage() {
  const { subjects, updateSubject, toggleTopic } = useSubjects();
  const navigate = useNavigate();
  const [generated, setGenerated] = useState(false);

  // Distribute incomplete topics across the week
  const incompleteBySub = subjects.map((s) => ({
    ...s,
    pending: s.topicList.filter((t) => !t.completed),
  }));

  const schedule = daysOfWeek.map((day, dayIdx) => ({
    day,
    tasks: incompleteBySub
      .filter((s) => s.pending.length > 0)
      .map((s) => {
        const hoursPerDay = Math.max(0.5, parseFloat(s.hoursPerDay || "1"));
        const topicIdx = dayIdx % s.pending.length;
        const topic = s.pending[topicIdx];
        return topic
          ? { subjectId: s.id, subject: s.name, icon: s.icon, topic, hours: hoursPerDay }
          : null;
      })
      .filter(Boolean) as { subjectId: string; subject: string; icon: string; topic: { id: string; name: string; completed: boolean }; hours: number }[],
  }));

  if (subjects.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-primary" /> Smart Study Planner
          </h1>
          <p className="text-muted-foreground mt-1">Input your subjects and let AI create an optimized schedule.</p>
        </motion.div>
        <GlassCard delay={0.1}>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">No subjects added yet</p>
            <p className="text-sm text-muted-foreground mb-4">Add subjects first to generate your study plan.</p>
            <Button variant="hero" size="sm" onClick={() => navigate("/subjects")}>
              <BookOpen className="w-4 h-4 mr-1" /> Go to Subjects
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-primary" /> Smart Study Planner
        </h1>
        <p className="text-muted-foreground mt-1">Configure your subjects and generate an optimized schedule.</p>
      </motion.div>

      <GlassCard delay={0.1}>
        <h2 className="font-display font-semibold text-lg mb-4 text-foreground">Your Subjects</h2>
        <div className="space-y-4">
          {subjects.map((s) => (
            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="text-xs text-muted-foreground">Subject</Label>
                <Input value={`${s.icon} ${s.name}`} disabled className="bg-muted/30 border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Exam Date</Label>
                <Input
                  type="date"
                  value={s.examDate}
                  onChange={(e) => updateSubject(s.id, { examDate: e.target.value })}
                  className="bg-muted/30 border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Hours/Day</Label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={s.hoursPerDay}
                  onChange={(e) => updateSubject(s.id, { hoursPerDay: e.target.value })}
                  className="bg-muted/30 border-border"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="hero" size="sm" onClick={() => setGenerated(true)}>
            <Sparkles className="w-4 h-4 mr-1" /> Generate Plan
          </Button>
        </div>
      </GlassCard>

      {generated && (
        <GlassCard delay={0.2}>
          <h2 className="font-display font-semibold text-lg mb-4 text-foreground">📅 Weekly Schedule</h2>
          <p className="text-xs text-muted-foreground mb-4">Click a topic to mark it complete. Your schedule updates automatically!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {schedule.map((day, i) => (
              <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-muted/20 border border-border">
                <p className="font-display font-semibold text-sm text-primary mb-3">{day.day}</p>
                <div className="space-y-2">
                  {day.tasks.length > 0 ? day.tasks.map((t) => (
                    <button
                      key={t.topic.id}
                      onClick={() => toggleTopic(t.subjectId, t.topic.id)}
                      className={`w-full text-left text-xs p-2 rounded border transition-colors flex items-center gap-2 ${
                        t.topic.completed
                          ? "bg-success/10 border-success/20 text-success"
                          : "bg-primary/5 border-primary/10"
                      }`}
                    >
                      {t.topic.completed ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <Circle className="w-3 h-3 shrink-0 text-muted-foreground" />}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{t.icon} {t.subject}</p>
                        <p className={`text-muted-foreground ${t.topic.completed ? "line-through" : ""}`}>{t.topic.name} • {t.hours.toFixed(1)}h</p>
                      </div>
                    </button>
                  )) : (
                    <p className="text-xs text-muted-foreground text-center py-2">No tasks</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
