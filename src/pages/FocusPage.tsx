import { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Music, VolumeX, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSubjects } from "@/contexts/SubjectsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FocusPage() {
  const { subjects, addStudyTime } = useSubjects();
  const [focusDuration, setFocusDuration] = useState(25);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string>("general");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const totalSeconds = minutes * 60 + seconds;
  const maxSeconds = isBreak ? 5 * 60 : focusDuration * 60;
  const progress = ((maxSeconds - totalSeconds) / maxSeconds) * 100;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes === 0) {
              setIsRunning(false);
              if (!isBreak) {
                setSessions((s) => s + 1);
                setTotalFocusTime((t) => t + focusDuration);
                addStudyTime(focusDuration);
                setIsBreak(true);
                setMinutes(5);
              } else {
                setIsBreak(false);
                setMinutes(focusDuration);
              }
              return 0;
            }
            setMinutes((m) => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, minutes, isBreak, focusDuration, addStudyTime]);

  const reset = () => { setIsRunning(false); setMinutes(isBreak ? 5 : focusDuration); setSeconds(0); };
  const pad = (n: number) => n.toString().padStart(2, "0");

  const handleDurationChange = (val: string) => {
    const dur = parseInt(val);
    setFocusDuration(dur);
    if (!isRunning && !isBreak) {
      setMinutes(dur);
      setSeconds(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Timer className="w-7 h-7 text-primary" /> Focus Mode
        </h1>
        <p className="text-muted-foreground mt-1">Distraction-free study with Pomodoro timer.</p>
      </motion.div>

      {/* Settings */}
      <GlassCard delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Focus Duration</label>
            <Select value={String(focusDuration)} onValueChange={handleDurationChange}>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Studying</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Study</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      <GlassCard delay={0.1} className="text-center py-12">
        <p className="text-sm font-display text-muted-foreground mb-2 uppercase tracking-wider">
          {isBreak ? "☕ Break Time" : "📚 Focus Session"}
        </p>

        <div className="relative w-56 h-56 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(230 20% 18%)" strokeWidth="4" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round" className="transition-all duration-1000" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(250 85% 65%)" />
                <stop offset="100%" stopColor="hsl(280 80% 65%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-display font-bold text-foreground">{pad(minutes)}:{pad(seconds)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="hero" size="lg" onClick={() => setIsRunning(!isRunning)} className="gap-2">
            {isRunning ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Start</>}
          </Button>
          <Button variant="glass" size="lg" onClick={reset}><RotateCcw className="w-5 h-5" /></Button>
          <Button variant={musicOn ? "default" : "glass"} size="lg" onClick={() => setMusicOn(!musicOn)}>
            {musicOn ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard delay={0.2} className="text-center">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{sessions}</p>
          <p className="text-xs text-muted-foreground">Sessions Completed</p>
        </GlassCard>
        <GlassCard delay={0.3} className="text-center">
          <Timer className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{totalFocusTime}m</p>
          <p className="text-xs text-muted-foreground">Total Focus Time</p>
        </GlassCard>
        <GlassCard delay={0.4} className="text-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <span className="text-3xl">🔥</span>
          </motion.div>
          <p className="text-xs text-muted-foreground mt-2">Keep going! You're doing great!</p>
        </GlassCard>
      </div>
    </div>
  );
}
