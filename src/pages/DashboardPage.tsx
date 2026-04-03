import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { Flame, Zap, Target, Brain, CheckCircle2, Circle, Lightbulb, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useSubjects } from "@/contexts/SubjectsContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { subjects, toggleTopic, xp, streak } = useSubjects();
  const navigate = useNavigate();

  const totalTopics = subjects.reduce((a, s) => a + s.topics, 0);
  const completedTopics = subjects.reduce((a, s) => a + s.completed, 0);

  const weakAreas = subjects
    .filter((s) => s.topics > 0)
    .map((s) => ({ subject: s.name, score: Math.round((s.completed / s.topics) * 100) }))
    .filter((s) => s.score < 60);

  // Today's tasks: pick up to 5 incomplete topics across subjects
  const todayTasks = subjects
    .flatMap((s) =>
      s.topicList
        .filter((t) => !t.completed)
        .slice(0, 2)
        .map((t) => ({ subjectId: s.id, subjectName: s.name, topic: t }))
    )
    .slice(0, 6);

  const aiSuggestions = subjects.length === 0
    ? ["Add your subjects to get personalized study suggestions", "Try the Focus Mode for distraction-free sessions"]
    : [
        weakAreas.length > 0
          ? `Focus on ${weakAreas[0].subject} — it's at ${weakAreas[0].score}% mastery`
          : "Great progress! Keep revising to maintain your momentum 🎉",
        `You've completed ${completedTopics} out of ${totalTopics} topics — ${totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0}% overall`,
        "Consistency matters more than hours — study a little every day! 📚",
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Welcome back, <span className="gradient-text">Student!</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your study overview for today.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Study Streak" value={`${streak} Days`} delay={0.1} iconColor="text-xp" />
        <StatCard icon={Zap} label="XP Points" value={xp.toLocaleString()} delay={0.2} iconColor="text-primary" />
        <StatCard icon={Target} label="Subjects" value={String(subjects.length)} delay={0.3} iconColor="text-success" />
        <StatCard icon={Brain} label="Topics Done" value={`${completedTopics}/${totalTopics}`} delay={0.4} iconColor="text-accent" />
      </div>

      {subjects.length === 0 ? (
        <GlassCard delay={0.3}>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">Get started by adding your subjects</p>
            <p className="text-sm text-muted-foreground mb-4">Your personalized dashboard will populate once you add subjects.</p>
            <Button variant="hero" size="sm" onClick={() => navigate("/subjects")}>
              <BookOpen className="w-4 h-4 mr-1" /> Add Subjects
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard delay={0.3} className="lg:col-span-2">
            <h2 className="font-display font-semibold text-lg mb-4 text-foreground">📋 Today's Study Plan</h2>
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <button
                    key={task.topic.id}
                    onClick={() => toggleTopic(task.subjectId, task.topic.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                  >
                    <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{task.topic.name}</p>
                      <p className="text-xs text-muted-foreground">{task.subjectName}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
                <p className="text-foreground font-medium">All caught up! 🎉</p>
                <p className="text-xs text-muted-foreground">All topics completed. Great work!</p>
              </div>
            )}

            {/* Subject progress overview */}
            <div className="mt-6 pt-4 border-t border-border space-y-3">
              <h3 className="font-display font-semibold text-sm text-muted-foreground">Subject Progress</h3>
              {subjects.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <Progress value={s.topics > 0 ? (s.completed / s.topics) * 100 : 0} className="h-1.5 mt-1" />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.completed}/{s.topics}</span>
                </div>
              ))}
            </div>
          </GlassCard>

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
      )}

      {weakAreas.length > 0 && (
        <GlassCard delay={0.5}>
          <h2 className="font-display font-semibold text-lg mb-4 text-foreground">⚠️ Weak Areas – Needs Attention</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weakAreas.map((area, i) => (
              <div key={i} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="font-medium text-sm text-foreground">{area.subject}</p>
                <Progress value={area.score} className="h-2 mt-2" />
                <p className="text-xs text-destructive mt-1">{area.score}% mastery</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
