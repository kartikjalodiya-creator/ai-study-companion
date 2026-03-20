import { GlassCard } from "@/components/GlassCard";
import { BookOpen, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSubjects, iconOptions } from "@/contexts/SubjectsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const colorPalettes = [
  "from-primary to-secondary",
  "from-secondary to-info",
  "from-accent to-primary",
  "from-success to-info",
  "from-xp to-warning",
  "from-primary to-accent",
];

export default function SubjectsPage() {
  const { subjects, addSubject, removeSubject } = useSubjects();
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTopics, setNewTopics] = useState("10");
  const [newIcon, setNewIcon] = useState("📚");

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    addSubject({
      name: newName.trim(),
      icon: newIcon,
      topics: parseInt(newTopics) || 10,
      completed: 0,
      examDate: "",
      hoursPerDay: "1",
    });
    setNewName("");
    setNewTopics("10");
    setNewIcon("📚");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary" /> Subjects
        </h1>
        <p className="text-muted-foreground mt-1">
          Add your subjects and track progress across all topics.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search subjects..."
          className="max-w-sm bg-muted/30 border-border"
        />
        <Button variant="hero" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Add Subject
        </Button>
      </div>

      {showForm && (
        <GlassCard delay={0}>
          <h3 className="font-display font-semibold text-foreground mb-3">New Subject</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Physics"
                className="bg-muted/30 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total Topics</Label>
              <Input
                type="number"
                min="1"
                value={newTopics}
                onChange={(e) => setNewTopics(e.target.value)}
                className="bg-muted/30 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Icon</Label>
              <Select value={newIcon} onValueChange={setNewIcon}>
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="hero" size="sm" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </GlassCard>
      )}

      {subjects.length === 0 && !showForm && (
        <GlassCard delay={0.1}>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">No subjects yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first subject to start tracking your study progress.
            </p>
            <Button variant="hero" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Your First Subject
            </Button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((subject, i) => (
          <GlassCard
            key={subject.id}
            delay={i * 0.1}
            className="group hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorPalettes[i % colorPalettes.length]} flex items-center justify-center text-2xl`}
                >
                  {subject.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {subject.topics} topics
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSubject(subject.id)}
                className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Progress
              value={(subject.completed / subject.topics) * 100}
              className="h-2 mb-2"
            />
            <p className="text-xs text-muted-foreground">
              {subject.completed}/{subject.topics} topics completed •{" "}
              {Math.round((subject.completed / subject.topics) * 100 || 0)}% mastery
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
