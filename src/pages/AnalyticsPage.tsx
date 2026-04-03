import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { BarChart3, Clock, TrendingUp, Brain, Lightbulb, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { useSubjects } from "@/contexts/SubjectsContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AnalyticsPage() {
  const { subjects, xp, studyLog } = useSubjects();
  const navigate = useNavigate();

  const totalTopics = subjects.reduce((a, s) => a + s.topics, 0);
  const completedTopics = subjects.reduce((a, s) => a + s.completed, 0);
  const avgMastery = subjects.length > 0
    ? Math.round(subjects.reduce((a, s) => a + (s.topics > 0 ? (s.completed / s.topics) * 100 : 0), 0) / subjects.length)
    : 0;

  const totalStudyMinutes = studyLog.reduce((a, l) => a + l.minutes, 0);

  const radarData = subjects.map((s) => ({
    subject: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
    score: s.topics > 0 ? Math.round((s.completed / s.topics) * 100) : 0,
  }));

  // Per-subject bar chart
  const subjectBarData = subjects.map((s) => ({
    name: s.name.length > 8 ? s.name.slice(0, 8) + "…" : s.name,
    completed: s.completed,
    remaining: s.topics - s.completed,
  }));

  // Simulate performance trend from completions
  const performanceData = subjects.length > 0
    ? [
        { point: "Start", score: 0 },
        { point: "Now", score: avgMastery },
        { point: "Target", score: Math.min(100, avgMastery + 15) },
      ]
    : [];

  const insights = subjects.length === 0
    ? ["Add subjects and start completing topics to see insights here"]
    : [
        completedTopics > 0
          ? `You've mastered ${completedTopics} topics across ${subjects.length} subjects`
          : "Start completing topics to track your progress",
        avgMastery >= 60
          ? `Strong performance at ${avgMastery}% average mastery! Keep it up 💪`
          : `Your average mastery is ${avgMastery}% — focus on weak areas to improve`,
        totalStudyMinutes > 0
          ? `${Math.round(totalStudyMinutes / 60)}h total study time logged`
          : "Use Focus Mode to log study time and earn XP",
        `You've earned ${xp} XP so far — complete topics for +25 XP each`,
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" /> Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Track your study patterns and performance over time.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Study Time" value={`${Math.round(totalStudyMinutes / 60)}h`} delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Mastery" value={`${avgMastery}%`} delay={0.2} iconColor="text-success" />
        <StatCard icon={Brain} label="Topics Mastered" value={String(completedTopics)} delay={0.3} iconColor="text-accent" />
        <StatCard icon={BarChart3} label="Subjects" value={String(subjects.length)} delay={0.4} iconColor="text-info" />
      </div>

      {subjects.length === 0 ? (
        <GlassCard delay={0.3}>
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">No data yet</p>
            <p className="text-sm text-muted-foreground mb-4">Add subjects and complete topics to see analytics.</p>
            <Button variant="hero" size="sm" onClick={() => navigate("/subjects")}>Add Subjects</Button>
          </div>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard delay={0.3}>
              <h2 className="font-display font-semibold text-lg mb-4 text-foreground">📊 Topics by Subject</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectBarData}>
                  <XAxis dataKey="name" stroke="hsl(220 15% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(230 25% 11%)", border: "1px solid hsl(230 20% 18%)", borderRadius: "8px", color: "hsl(220 20% 95%)" }} />
                  <Bar dataKey="completed" fill="hsl(160 70% 45%)" radius={[6, 6, 0, 0]} name="Completed" stackId="a" />
                  <Bar dataKey="remaining" fill="hsl(250 85% 65%)" radius={[6, 6, 0, 0]} name="Remaining" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {performanceData.length > 0 && (
              <GlassCard delay={0.4}>
                <h2 className="font-display font-semibold text-lg mb-4 text-foreground">📈 Mastery Trend</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 20% 18%)" />
                    <XAxis dataKey="point" stroke="hsl(220 15% 55%)" fontSize={12} />
                    <YAxis stroke="hsl(220 15% 55%)" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "hsl(230 25% 11%)", border: "1px solid hsl(230 20% 18%)", borderRadius: "8px", color: "hsl(220 20% 95%)" }} />
                    <Line type="monotone" dataKey="score" stroke="hsl(280 80% 65%)" strokeWidth={2} dot={{ fill: "hsl(280 80% 65%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard delay={0.5}>
              <h2 className="font-display font-semibold text-lg mb-4 text-foreground">🎯 Subject Comparison</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(230 20% 18%)" />
                  <PolarAngleAxis dataKey="subject" stroke="hsl(220 15% 55%)" fontSize={11} />
                  <Radar dataKey="score" stroke="hsl(250 85% 65%)" fill="hsl(250 85% 65%)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard delay={0.6}>
              <h2 className="font-display font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-xp" /> AI Insights
              </h2>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-foreground/80">{insight}</div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
