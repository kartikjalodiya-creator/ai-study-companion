import { GlassCard } from "@/components/GlassCard";
import { BookOpen, ChevronDown, ChevronRight, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
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
  const { subjects, addSubject, removeSubject, toggleTopic } = useSubjects();
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("📚");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    addSubject({
      name: newName.trim(),
      icon: newIcon,
      examDate: "",
      hoursPerDay: "1",
    });
    setNewName("");
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
          <p className="text-xs text-muted-foreground mb-3">
            Enter a subject name (e.g. Physics, Chemistry, Mathematics) and we'll auto-generate all topics for you!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <Label className="text-xs text-muted-foreground">Subject Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Physics, Chemistry, Biology..."
                className="bg-muted/30 border-border"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
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
              Add your first subject to start tracking your study progress. Topics will be auto-generated!
            </p>
            <Button variant="hero" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Your First Subject
            </Button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((subject, i) => {
          const isExpanded = expandedId === subject.id;
          const pct = subject.topics > 0 ? Math.round((subject.completed / subject.topics) * 100) : 0;
          return (
            <GlassCard
              key={subject.id}
              delay={i * 0.1}
              className="group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => setExpandedId(isExpanded ? null : subject.id)}
                >
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
                      {subject.topics} topics • {pct}% done
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubject(subject.id)}
                  className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Progress value={pct} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {subject.completed}/{subject.topics} topics completed
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border space-y-1 max-h-64 overflow-y-auto">
                      {subject.topicList.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => toggleTopic(subject.id, topic.id)}
                          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                            topic.completed
                              ? "bg-success/10 text-success"
                              : "hover:bg-muted/30 text-foreground"
                          }`}
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className={topic.completed ? "line-through opacity-70" : ""}>
                            {topic.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
