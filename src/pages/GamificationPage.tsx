import { GlassCard } from "@/components/GlassCard";
import { Trophy, Flame, Star, Medal, Crown, Zap, Target, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useSubjects } from "@/contexts/SubjectsContext";

const leaderboard = [
  { rank: 1, name: "Aarav S.", xp: 5200, streak: 28 },
  { rank: 2, name: "Emily W.", xp: 4800, streak: 21 },
  { rank: 3, name: "Rahul K.", xp: 4350, streak: 19 },
];

export default function GamificationPage() {
  const { xp, streak, subjects } = useSubjects();

  const totalTopics = subjects.reduce((a, s) => a + s.topics, 0);
  const completedTopics = subjects.reduce((a, s) => a + s.completed, 0);
  const allMastered = totalTopics > 0 && completedTopics === totalTopics;

  const badges = [
    { name: "First Steps", icon: Star, earned: completedTopics >= 1, desc: "Complete your first topic" },
    { name: "Getting Started", icon: Zap, earned: subjects.length >= 1, desc: "Add your first subject" },
    { name: "Streak Starter", icon: Flame, earned: streak >= 3, desc: "3-day study streak" },
    { name: "Streak Master", icon: Flame, earned: streak >= 7, desc: "7-day study streak" },
    { name: "Half Way", icon: Target, earned: totalTopics > 0 && completedTopics >= totalTopics / 2, desc: "Complete 50% of all topics" },
    { name: "Centurion", icon: Medal, earned: xp >= 100, desc: "Earn 100 XP" },
    { name: "All Rounder", icon: Crown, earned: allMastered, desc: "Master all subjects" },
    { name: "Legend", icon: Trophy, earned: xp >= 10000, desc: "Earn 10,000 XP" },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;

  // Insert user into leaderboard
  const fullLeaderboard = [...leaderboard, { rank: 0, name: "You", xp, streak, isYou: true as const }]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-7 h-7 text-xp" /> Gamification
        </h1>
        <p className="text-muted-foreground mt-1">Earn XP, collect badges, and climb the leaderboard!</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard delay={0.1} className="text-center">
          <Zap className="w-10 h-10 text-xp mx-auto mb-2" />
          <p className="text-3xl font-display font-bold text-foreground">{xp.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total XP</p>
          <Progress value={Math.min(100, (xp / 10000) * 100)} className="h-2 mt-3" />
          <p className="text-xs text-muted-foreground mt-1">{xp.toLocaleString()} / 10,000 to Legend</p>
        </GlassCard>
        <GlassCard delay={0.2} className="text-center">
          <Flame className="w-10 h-10 text-destructive mx-auto mb-2" />
          <p className="text-3xl font-display font-bold text-foreground">{streak}</p>
          <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i < Math.min(streak, 7) ? "bg-destructive/20 text-destructive" : "bg-muted/30 text-muted-foreground"}`}>
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard delay={0.3} className="text-center">
          <Medal className="w-10 h-10 text-primary mx-auto mb-2" />
          <p className="text-3xl font-display font-bold text-foreground">{earnedCount}/{badges.length}</p>
          <p className="text-sm text-muted-foreground">Badges Earned</p>
        </GlassCard>
      </div>

      <GlassCard delay={0.4}>
        <h2 className="font-display font-semibold text-lg mb-4 text-foreground">🏆 Badge Collection</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <motion.div key={badge.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl text-center transition-all ${badge.earned ? "bg-primary/10 border border-primary/20" : "bg-muted/20 border border-border opacity-50"}`}>
              <badge.icon className={`w-8 h-8 mx-auto mb-2 ${badge.earned ? "text-xp" : "text-muted-foreground"}`} />
              <p className="font-display font-semibold text-sm text-foreground">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
              {badge.earned && <p className="text-xs text-success mt-1">✓ Earned</p>}
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={0.5}>
        <h2 className="font-display font-semibold text-lg mb-4 text-foreground">🏅 Leaderboard</h2>
        <div className="space-y-2">
          {fullLeaderboard.map((entry) => (
            <div key={entry.rank} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${"isYou" in entry && entry.isYou ? "bg-primary/10 border border-primary/20" : "bg-muted/20"}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm ${entry.rank <= 3 ? "bg-xp/20 text-xp" : "bg-muted/30 text-muted-foreground"}`}>
                {entry.rank}
              </span>
              <span className={`flex-1 font-medium text-sm ${"isYou" in entry && entry.isYou ? "text-primary" : "text-foreground"}`}>{entry.name}</span>
              <span className="text-sm text-xp font-display font-semibold">{entry.xp.toLocaleString()} XP</span>
              <span className="text-xs text-muted-foreground">🔥 {entry.streak}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
