import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { BarChart3, Clock, TrendingUp, Brain, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

const weeklyData = [
  { day: "Mon", hours: 4 }, { day: "Tue", hours: 5.5 }, { day: "Wed", hours: 3 },
  { day: "Thu", hours: 6 }, { day: "Fri", hours: 4.5 }, { day: "Sat", hours: 7 }, { day: "Sun", hours: 2 },
];

const performanceData = [
  { week: "W1", score: 55 }, { week: "W2", score: 60 }, { week: "W3", score: 58 },
  { week: "W4", score: 67 }, { week: "W5", score: 72 }, { week: "W6", score: 78 },
];

const radarData = [
  { subject: "Physics", score: 65 }, { subject: "Math", score: 80 },
  { subject: "Chemistry", score: 45 }, { subject: "Biology", score: 75 },
  { subject: "English", score: 88 }, { subject: "CS", score: 82 },
];

const insights = [
  "Your Physics scores have improved 15% this month! Keep going 💪",
  "Chemistry needs more attention – try 30 min extra daily",
  "Predicted exam score: 78% (up from 72%)",
  "Best study time: 9 AM – 12 PM based on your performance data",
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" /> Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Track your study patterns and performance over time.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Total Study Hours" value="32h" change="+5h vs last week" delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg Score" value="78%" change="+6% improvement" delay={0.2} iconColor="text-success" />
        <StatCard icon={Brain} label="Topics Mastered" value="24" delay={0.3} iconColor="text-accent" />
        <StatCard icon={BarChart3} label="Predicted Score" value="82%" change="Trending up" delay={0.4} iconColor="text-info" />
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
    </div>
  );
}
