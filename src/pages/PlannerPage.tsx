import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useSubjects } from "@/contexts/SubjectsContext";
import { useNavigate } from "react-router-dom";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage() {
  const { subjects, updateSubject } = useSubjects();
  const navigate = useNavigate();
  const [generated, setGenerated] = useState(false);

  const schedule = daysOfWeek.map((day) => ({
    day,
    tasks: subjects.filter(s => s.name).map((s) => ({
      subject: s.name,
      hours: Math.max(0.5, parseFloat(s.hoursPerDay || "1") / 2 + Math.random()),
      topic: `Review Chapter ${Math.floor(Math.random() * 10 + 1)}`,
    })),
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
                <Input value={s.name} disabled className="bg-muted/30 border-border" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {schedule.map((day, i) => (
              <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-muted/20 border border-border">
                <p className="font-display font-semibold text-sm text-primary mb-3">{day.day}</p>
                <div className="space-y-2">
                  {day.tasks.map((t, j) => (
                    <div key={j} className="text-xs p-2 rounded bg-primary/5 border border-primary/10">
                      <p className="font-medium text-foreground">{t.subject}</p>
                      <p className="text-muted-foreground">{t.topic} • {t.hours.toFixed(1)}h</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
