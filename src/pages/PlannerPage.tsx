import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Plus, Trash2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Subject {
  name: string;
  examDate: string;
  hoursPerDay: string;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "Physics", examDate: "2026-04-15", hoursPerDay: "2" },
    { name: "Mathematics", examDate: "2026-04-18", hoursPerDay: "3" },
  ]);
  const [generated, setGenerated] = useState(false);

  const addSubject = () => setSubjects([...subjects, { name: "", examDate: "", hoursPerDay: "1" }]);
  const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const updateSubject = (i: number, field: keyof Subject, value: string) => {
    const updated = [...subjects];
    updated[i] = { ...updated[i], [field]: value };
    setSubjects(updated);
  };

  const schedule = daysOfWeek.map((day) => ({
    day,
    tasks: subjects.filter(s => s.name).map((s) => ({
      subject: s.name,
      hours: Math.max(0.5, parseFloat(s.hoursPerDay || "1") / 2 + Math.random()),
      topic: `Review Chapter ${Math.floor(Math.random() * 10 + 1)}`,
    })),
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-primary" /> Smart Study Planner
        </h1>
        <p className="text-muted-foreground mt-1">Input your subjects and let AI create an optimized schedule.</p>
      </motion.div>

      <GlassCard delay={0.1}>
        <h2 className="font-display font-semibold text-lg mb-4 text-foreground">Your Subjects</h2>
        <div className="space-y-4">
          {subjects.map((s, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <Label className="text-xs text-muted-foreground">Subject</Label>
                <Input value={s.name} onChange={(e) => updateSubject(i, "name", e.target.value)} placeholder="e.g. Physics" className="bg-muted/30 border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Exam Date</Label>
                <Input type="date" value={s.examDate} onChange={(e) => updateSubject(i, "examDate", e.target.value)} className="bg-muted/30 border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Hours/Day</Label>
                <Input type="number" min="0.5" step="0.5" value={s.hoursPerDay} onChange={(e) => updateSubject(i, "hoursPerDay", e.target.value)} className="bg-muted/30 border-border" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSubject(i)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" size="sm" onClick={addSubject}><Plus className="w-4 h-4 mr-1" /> Add Subject</Button>
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
