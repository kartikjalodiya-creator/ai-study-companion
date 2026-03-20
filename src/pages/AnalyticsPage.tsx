import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { BarChart3, Clock, TrendingUp, Brain, Lightbulb, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { useSubjects } from "@/contexts/SubjectsContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const weeklyData = [
  { day: "Mon", hours: 4 }, { day: "Tue", hours: 5.5 }, { day: "Wed", hours: 3 },
  { day: "Thu", hours: 6 }, { day: "Fri", hours: 4.5 }, { day: "Sat", hours: 7 }, { day: "Sun", hours: 2 },
];

const performanceData = [
  { week: "W1", score: 55 }, { week: "W2", score: 60 }, { week: "W3", score: 58 },
  { week: "W4", score: 67 }, { week: "W5", score: 72 }, { week: "W6", score: 78 },
];

const insights = [
  "Add subjects and track progress to get personalized insights",
  "Consistency is key – study a little every day",
  "Best study time: 9 AM – 12 PM based on research data",
];

export default function AnalyticsPage() {
  const { subjects } = useSubjects();
  const navigate = useNavigate();

  const radarData = subjects.map((s) => ({
    subject: s.name,
    score: s.topics > 0 ? Math.round((s.completed / s.topics) * 100) : 0,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" /> Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Track your study patterns and performance over time.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Total Study Hours" value="0h" delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Score" value="—" delay={0.2} iconColor="text-success" />
        <StatCard icon={Brain} label="Topics Mastered" value={String(subjects.reduce((a, s) => a + s.completed, 0))} delay={0.3} iconColor="text-accent" />
        <StatCard icon={BarChart3} label="Subjects" value={String(subjects.length)} delay={0.4} iconColor="text-info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard delay={0.3}>
          <h2 className="font-display font-semibold text-lg mb-4 text-foreground">📊 Study Time (This Week)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" stroke="hsl(220 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(230 25% 11%)", border: "1px solid hsl(230 20% 18%)", borderRadius: "8px", color: "hsl(220 20% 95%)" }} />
              <Bar dataKey="hours" fill="hsl(250 85% 65%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.4}>
          <h2 className="font-display font-semibold text-lg mb-4 text-foreground">📈 Performance Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 20% 18%)" />
              <XAxis dataKey="week" stroke="hsl(220 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(230 25% 11%)", border: "1px solid hsl(230 20% 18%)", borderRadius: "8px", color: "hsl(220 20% 95%)" }} />
              <Line type="monotone" dataKey="score" stroke="hsl(280 80% 65%)" strokeWidth={2} dot={{ fill: "hsl(280 80% 65%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.length > 0 ? (
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
        ) : (
          <GlassCard delay={0.5}>
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">No subjects to compare</p>
              <p className="text-sm text-muted-foreground mb-4">Add subjects to see your performance radar.</p>
              <Button variant="hero" size="sm" onClick={() => navigate("/subjects")}>Add Subjects</Button>
            </div>
          </GlassCard>
        )}

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
    </div>
  );
}
