import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, UserPlus, FileText, Trophy, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const groups = [
  { name: "Physics Avengers", members: 8, notes: 12, challenges: 3, active: true },
  { name: "Math Wizards", members: 5, notes: 8, challenges: 2, active: true },
  { name: "Bio Champions", members: 12, notes: 20, challenges: 5, active: false },
];

const challenges = [
  { title: "100 MCQs Sprint", group: "Physics Avengers", progress: 72, participants: 6 },
  { title: "Integration Marathon", group: "Math Wizards", progress: 45, participants: 4 },
  { title: "Weekly Quiz Battle", group: "Bio Champions", progress: 90, participants: 10 },
];

export default function GroupsPage() {
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" /> Study Groups
        </h1>
        <p className="text-muted-foreground mt-1">Collaborate, compete, and learn together.</p>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <Button variant="hero" size="sm"><Plus className="w-4 h-4 mr-1" /> Create Group</Button>
        <div className="flex gap-2">
          <Input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Enter invite code..." className="bg-muted/30 border-border w-48" />
          <Button variant="glass" size="sm"><UserPlus className="w-4 h-4 mr-1" /> Join</Button>
        </div>
      </div>

      {/* Groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group, i) => (
          <GlassCard key={group.name} delay={i * 0.1} className="hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-foreground">{group.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${group.active ? "bg-success/20 text-success" : "bg-muted/30 text-muted-foreground"}`}>
                {group.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {group.members}</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {group.notes} notes</span>
              <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {group.challenges} challenges</span>
            </div>
            <Button variant="glass" size="sm" className="w-full mt-4 gap-1">
              <MessageSquare className="w-4 h-4" /> Open Group
            </Button>
          </GlassCard>
        ))}
      </div>

      {/* Challenges */}
      <GlassCard delay={0.4}>
        <h2 className="font-display font-semibold text-lg mb-4 text-foreground">🏆 Active Challenges</h2>
        <div className="space-y-4">
          {challenges.map((ch, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/20 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">{ch.title}</p>
                  <p className="text-xs text-muted-foreground">{ch.group} • {ch.participants} participants</p>
                </div>
                <span className="text-sm font-display font-bold text-primary">{ch.progress}%</span>
              </div>
              <Progress value={ch.progress} className="h-2" />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
